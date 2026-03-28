import { backendFetch } from "./backend";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "EDITOR" | "VIEWER";
};

type AuthResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};

export async function fetchCurrentUser(cookie?: string): Promise<AuthResponse> {
  const response = await backendFetch("/auth/me", {}, cookie);

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json() as Promise<AuthResponse>;
}

export async function logout(): Promise<void> {
  const response = await backendFetch("/auth/logout", {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
}
