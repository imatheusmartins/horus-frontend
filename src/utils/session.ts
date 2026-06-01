export interface AuthUser {
  id?: string | number;
  usuarioId?: string | number;
  userId?: string | number;
  nome?: string;
  email?: string;
  token?: string;
}

export function getAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem("authUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthUserId(authUser: AuthUser | null) {
  return authUser?.id ?? authUser?.usuarioId ?? authUser?.userId ?? null;
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("authUser");
}

