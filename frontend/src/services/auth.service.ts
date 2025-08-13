import { apiUser, apiAdmin } from "../lib/api";
import type { AuthResponse } from "../types/api";

// user auth
export async function signup(payload: { name: string; email: string; password: string }) {
  const { data } = await apiUser.post<AuthResponse>("/api/auth/signup", payload);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await apiUser.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function me() {
  const { data } = await apiUser.get<{ user: AuthResponse["user"] }>("/api/auth/me");
  return data.user;
}

//admin
export async function adminLogin(payload: { username: string; password: string }) {
  const { data } = await apiAdmin.post<{ token: string; admin: { username: string } }>("/api/admin/login", payload);
  return data;
}
