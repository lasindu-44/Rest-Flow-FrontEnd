import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  name?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  role?: string;
}

export function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return (
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role ||
      null
    );
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}