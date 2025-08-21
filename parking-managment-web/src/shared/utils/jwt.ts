import type { JWTPayload } from '../../features/auth/api/types';

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
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);

    // Validate required fields - updated for actual backend structure
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
