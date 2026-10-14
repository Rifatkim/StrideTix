"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, LoginCredentials, RegisterPayload, UserRole } from "@/types";
import {
  getStoredUser,
  login as authServiceLogin,
  logout as authServiceLogout,
  register as authServiceRegister,
  switchDemoRole,
} from "@/services/authService";

interface AuthContextValue {
  currentUser: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Load persisted or default user
    const user = getStoredUser();
    setCurrentUser(user);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const user = await authServiceLogin(credentials);
    setCurrentUser(user);
    return user;
  };

  const register = async (payload: RegisterPayload): Promise<AuthUser> => {
    const user = await authServiceRegister(payload);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authServiceLogout();
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const user = switchDemoRole(role);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
