export type AuthSession = {
  email: string;
  userId?: string;
  displayName?: string;
};

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem("whis-auth-session");
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  sessionStorage.setItem("whis-auth-session", JSON.stringify(session));
}

export function clearAuthSession() {
  sessionStorage.removeItem("whis-auth-session");
}
