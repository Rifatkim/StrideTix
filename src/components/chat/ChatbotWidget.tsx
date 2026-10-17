"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { QUICK_PROMPT_STARTERS, AI_ASSISTANT_DISCLAIMER } from "@/lib/mock-data/chatResponses";
import { useAuth } from "@/context/AuthContext";
import { useRunner } from "@/context/RunnerContext";
import { AIChatMessage } from "@/types/ai";
import { ChatMessageContent } from "./ChatMessageContent";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export function ChatbotWidget() {
  const { currentUser, role } = useAuth();
  const { currentProfile, recommendation } = useRunner();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      sender: "bot",
      text: "Halo! Saya Asisten Lari StrideTix 🏃 didukung oleh Groq AI. Ada yang bisa saya bantu seputar persiapan lomba, checklist perlengkapan, hidrasi, atau strategi pace Anda?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isBookingBarActive, setIsBookingBarActive] = useState(false);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ active?: boolean }>;
      setIsBookingBarActive(Boolean(customEvent.detail?.active));
    };

    window.addEventListener("stridetix:booking-bar", handleToggle);

    if (typeof document !== "undefined" && document.querySelector("[data-sticky-booking-bar]")) {
      setIsBookingBarActive(true);
    }

    return () => {
      window.removeEventListener("stridetix:booking-bar", handleToggle);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  // AI Assistant HANYA khusus untuk pelari yang sudah login
  if (!currentUser || role !== "runner") {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now() + 1}`;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text },
    ];

    setMessages(updatedMessages);
    if (!textToSend) setInputValue("");
    setIsThinking(true);

    try {
      // Siapkan payload riwayat untuk API
      const apiMessages: AIChatMessage[] = updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          runnerContext: currentProfile
            ? {
                targetCategory: recommendation?.recommendedCategory || undefined,
                longestRunKm: currentProfile.summary.longestRunKm,
                weeklyFrequency: currentProfile.summary.weeklyFrequency,
                averagePaceMinPerKm: currentProfile.summary.averagePaceMinPerKm,
                readinessLevel: recommendation?.readiness,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: botMsgId, sender: "bot", text: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            sender: "bot",
            text:
              data.reply ||
              "Maaf, asisten sedang mengalami kendala jaringan. Silakan coba kembali sesaat lagi.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "bot",
          text:
            "Koneksi ke server AI terputus. Pastikan internet Anda aktif dan silakan kirim ulang pesan Anda.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 z-40 transition-all duration-300 ${
        isBookingBarActive
          ? "bottom-48 sm:bottom-24"
          : "bottom-20 md:bottom-6"
      }`}
    >
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand hover:bg-brand-800 text-white shadow-warm-modal transition-all duration-200 hover:scale-105"
          aria-label="Buka Chatbot AI Running Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <Sparkles className="w-3 h-3 text-accent-ai absolute -top-1.5 -right-1.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">AI Running Assistant</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[420px] h-[540px] max-h-[85vh] bg-white rounded-modal border border-sand-border shadow-warm-modal flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-brand-800 px-4 py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm leading-tight">StrideTix AI</span>
                  <span className="w-2 h-2 rounded-full bg-accent-success" />
                </div>
                <span className="text-[10px] text-white/80 block">Groq Cloud • LLaMA/GPT-OSS</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Medical Disclaimer Alert (FR-CHAT-06) */}
          <div className="bg-accent-warning-bg px-3.5 py-2 border-b border-accent-warning-border flex items-center gap-2 text-[10px] text-[#59422A] shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-accent-warning shrink-0" />
            <span>{AI_ASSISTANT_DISCLAIMER}</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 items-start ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    msg.sender === "user"
                      ? "bg-brand text-white"
                      : "bg-brand-100 text-brand-800"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-card px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-brand text-white font-medium"
                      : "bg-surface-soft border border-sand-border text-espresso shadow-xs"
                  }`}
                >
                  <ChatMessageContent content={msg.text} isUser={msg.sender === "user"} />
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] bg-brand-100 text-brand-800">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-card px-3.5 py-2.5 bg-surface-soft border border-sand-border text-espresso flex items-center gap-2 text-xs text-espresso-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
                  <span>Sedang memproses jawaban...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Predefined Questions */}
          <div className="px-3 py-2 border-t border-sand-border bg-surface-main shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {QUICK_PROMPT_STARTERS.map((prompt) => (
                <button
                  key={prompt.id}
                  disabled={isThinking}
                  onClick={() => handleSendMessage(prompt.question)}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 border border-sand-border text-espresso font-semibold whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-sand-border bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Tanyakan persiapan lari Anda..."
              value={inputValue}
              disabled={isThinking}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 rounded-input bg-surface-main border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              className="p-2.5 rounded-btn bg-brand hover:bg-brand-800 text-white disabled:opacity-40 transition-colors flex items-center justify-center"
            >
              {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
