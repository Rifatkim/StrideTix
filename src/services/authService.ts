import { AuthUser, LoginCredentials, RegisterPayload, UserRole } from "@/types";

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  runner: {
    id: "usr-runner-01",
    email: "budi@stridetix.com",
    name: "Budi Pratama",
    role: "runner",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  organizer: {
    id: "usr-org-01",
    email: "organizer@stridejkt.com",
    name: "Hendra Wijaya",
    role: "organizer",
    organizerName: "Stride Jakarta Athletics",
    organizerStatus: "verified",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-07-15T00:00:00.000Z",
  },
  admin: {
    id: "usr-admin-01",
    email: "admin@stridetix.com",
    name: "Super Admin StrideTix",
    role: "admin",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
};

const AUTH_STORAGE_KEY = "stridetix_auth_session";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error("Failed to persist auth session", err);
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (credentials.demoRole && DEMO_USERS[credentials.demoRole]) {
    const user = DEMO_USERS[credentials.demoRole];
    saveStoredUser(user);
    return user;
  }

  // Fallback to checking email
  const email = credentials.email.toLowerCase();
  let user: AuthUser;

  if (email.includes("admin")) {
    user = DEMO_USERS.admin;
  } else if (email.includes("organizer")) {
    user = DEMO_USERS.organizer;
  } else {
    user = {
      id: `usr-${Date.now()}`,
      email: credentials.email,
      name: credentials.email.split("@")[0].replace(".", " "),
      role: "runner",
      createdAt: new Date().toISOString(),
    };
  }

  saveStoredUser(user);
  return user;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const newUser: AuthUser = {
    id: `usr-${Date.now()}`,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    organizerName: payload.role === "organizer" ? payload.organizerName || payload.name : undefined,
    organizerStatus: payload.role === "organizer" ? "pending" : undefined,
    createdAt: new Date().toISOString(),
  };

  saveStoredUser(newUser);
  return newUser;
}

export async function logout(): Promise<void> {
  saveStoredUser(null);
}

export function switchDemoRole(role: UserRole): AuthUser {
  const user = DEMO_USERS[role];
  saveStoredUser(user);
  return user;
}
