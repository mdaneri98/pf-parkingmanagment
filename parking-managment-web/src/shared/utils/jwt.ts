import type { JWTPayload } from '../../features/auth/api/types';
import { appStorage } from './storage';



export function decodeJWT(token: string): JWTPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
    const decodedPayload = atob(b64 + pad);
    const parsedPayload = JSON.parse(decodedPayload);

    if (!parsedPayload.roles || !Array.isArray(parsedPayload.roles) || !parsedPayload.sub) {
      return null;
    }

    return parsedPayload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractUserRole(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.roles || !Array.isArray(payload.roles)) {
    return null;
  }
  
  // Check if user has MANAGER role (case-insensitive)
  const hasManagerRole = payload.roles.some(role => 
    role.toUpperCase() === 'MANAGER'
  );
  
  return hasManagerRole ? 'manager' : null;
}

export function isTokenValid(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function validateStoredTokens(): { 
  isValid: boolean; 
  accessToken: string | null; 
  refreshToken: string | null;
  userRole: string | null;
} {
  const auth = appStorage.getAuth();
  
  if (!auth?.accessToken || !auth?.refreshToken) {
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  if (!isTokenValid(auth.accessToken)) {
    appStorage.clearAuth();
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  const userRole = extractUserRole(auth.accessToken);
  if (!userRole || userRole !== 'manager') {
    appStorage.clearAuth();
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  return { isValid: true, accessToken: auth.accessToken, refreshToken: auth.refreshToken, userRole };
}

export function isTokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= thresholdSeconds;
}


