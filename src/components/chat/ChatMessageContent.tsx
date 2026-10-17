"use client";

import React from "react";

interface ChatMessageContentProps {
  content: string;
  isUser?: boolean;
}

/**
 * Format inline text styles: **bold**, *italic*, and `code`
 */
function renderInlineFormatted(text: string): React.ReactNode[] {
  // Regex memisahkan token bold (**teks**), italic (*teks*), and inline code (`code`)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Teks sebelum kecocokan
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-espresso">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-espresso-muted">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded bg-sand-subtle text-[11px] font-mono text-brand-900 border border-sand-border"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Komponen parsing dan penampil pesan AI dengan tipografi rapi,
 * dukungan checklist, bullet points, dan fallback tabel adaptif.
 */
export function ChatMessageContent({ content, isUser = false }: ChatMessageContentProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Pecah teks berdasarkan baris untuk diproses
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (keyIdx: number) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      renderedElements.push(
        <div
          key={`table-${keyIdx}`}
          className="my-2.5 overflow-x-auto rounded-lg border border-sand-border shadow-xs"
        >
          <table className="min-w-full text-[11px] divide-y divide-sand-border">
            {tableHeader.length > 0 && (
              <thead className="bg-sand-subtle text-espresso font-bold">
                <tr>
                  {tableHeader.map((h, i) => (
                    <th key={i} className="px-2.5 py-1.5 text-left font-semibold">
                      {renderInlineFormatted(h.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-sand-border bg-white">
              {tableRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? "bg-white" : "bg-surface-soft/60"}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1.5 align-top text-espresso">
                      {renderInlineFormatted(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Deteksi baris tabel markdown (| col1 | col2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Abaikan baris separator seperti |---|---|
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

      if (isSeparator) {
        // Baris pembatas header tabel
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    // Baris kosong
    if (!trimmed) {
      renderedElements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Heading (### atau ##)
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      const headingText = trimmed.replace(/^#+\s*/, "");
      renderedElements.push(
        <h4
          key={`h-${i}`}
          className="font-bold text-espresso text-[13px] mt-2 mb-1 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          {renderInlineFormatted(headingText)}
        </h4>
      );
      continue;
    }

    // Sub-heading bertanda bintang (contoh: **1. Identitas & Registrasi**)
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 50) {
      renderedElements.push(
        <div
          key={`sh-${i}`}
          className="font-bold text-brand-900 text-xs mt-2.5 mb-1 bg-brand-50/70 px-2 py-1 rounded-md border-l-2 border-brand"
        >
          {trimmed.slice(2, -2)}
        </div>
      );
      continue;
    }

    // Bullet points (- atau * atau •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, "");
      renderedElements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-brand font-bold text-xs leading-5 shrink-0">•</span>
          <span className="leading-relaxed text-espresso flex-1">
            {renderInlineFormatted(itemText)}
          </span>
        </div>
      );
      continue;
    }

    // Numbered list (1. 2. dll)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      renderedElements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sand-subtle text-brand-800 text-[10px] font-bold shrink-0 mt-0.5 border border-sand-border">
            {num}
          </span>
          <span className="leading-relaxed text-espresso flex-1">
            {renderInlineFormatted(itemText)}
          </span>
        </div>
      );
      continue;
    }

    // Paragraf biasa
    renderedElements.push(
      <p key={`p-${i}`} className="leading-relaxed text-espresso my-0.5">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  }

  // Jika tabel berada di akhir teks
  if (inTable) {
    flushTable(lines.length);
  }

  return <div className="space-y-0.5 text-xs text-espresso">{renderedElements}</div>;
}
