import { api } from "@/infra/axios.config";
import type IUser from "@/types/User";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  password: string;
}

type ChangePasswordPayload = {
  action: "CHANGE_PASSWORD";
  new_password: string;
};

export async function createUser(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
}

export async function getUser(user_id: string): Promise<IUser> {
  const response = await api.get<IUser>(`/users/${user_id}`);
  return response.data;
}

export async function changePassword(
  user_id: string,
  payload: ChangePasswordPayload,
): Promise<IUser> {
  const response = await api.put<IUser>(`/change_password/${user_id}`, payload);
  return response.data;
}

export async function deleteUser(user_id: string): Promise<IUser> {
  const response = await api.delete<IUser>(`/users/${user_id}`);
  return response.data;
}
