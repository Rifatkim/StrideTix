export type UserRole = "runner" | "organizer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  organizerName?: string;
  organizerStatus?: "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  demoRole?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: "runner" | "organizer";
  organizerName?: string;
}
