import type { JWTPayload } from '../types/auth';
import { appStorage } from './storage';


// Helpers
function decodeBase64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
  return atob(b64 + pad);
}


export function decodeJWT(token: string): JWTPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}


export function getTokenPayload(token: string): JWTPayload | null {
  return decodeJWT(token);
}


export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}


export function validateAccessToken(token: string | null) {
  if (!token) return { isValid: false, isExpired: true, payload: null as JWTPayload | null };
  const payload = decodeJWT(token);
  if (!payload) return { isValid: false, isExpired: true, payload: null };
  const expired = isTokenExpired(token);
  return { isValid: !expired, isExpired: expired, payload };
}


export function extractUserRoles(token: string): string[] {
  const payload = decodeJWT(token);
  return Array.isArray(payload?.roles) ? payload!.roles : [];
}


export function hasAllowedRole(roles: string[], allowed?: string[]): boolean {
  if (!allowed || allowed.length === 0) return true; // no gating
  const set = new Set(roles.map((r) => r.toUpperCase()));
  return allowed.some((a) => set.has(a.toUpperCase()));
}


export function validateStoredTokens(args?: { allowedRoles?: string[] }) {
  const { allowedRoles } = args ?? {};
  const auth = appStorage.getAuth();


  const empty = {
    isValid: false,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    userRoles: [] as string[],
    payload: null as JWTPayload | null,
  };


  if (!auth?.accessToken || !auth?.refreshToken) {
    return empty;
  }


  const { isValid, isExpired, payload } = validateAccessToken(auth.accessToken);
  if (!isValid || isExpired || !payload) {
    return { ...empty, accessToken: auth.accessToken, refreshToken: auth.refreshToken };
  }


  const roles = extractUserRoles(auth.accessToken);
  if (!hasAllowedRole(roles, allowedRoles)) {
    // Optional: clear if role doesn't meet gate
    appStorage.clearAuth();
    return empty;
  }


  return {
    isValid: true,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    userRoles: roles,
    payload,
  };
}