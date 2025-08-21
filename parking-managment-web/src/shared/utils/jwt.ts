import type { JWTPayload } from '../../features/auth/api/types';

const STORAGE_PREFIX = 'pmw:';
const ACCESS_TOKEN_KEY = `${STORAGE_PREFIX}access_token`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refresh_token`;
const AUTH_OBJECT_KEY = `${STORAGE_PREFIX}auth:v1`;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getStorage(): StorageLike {
  return globalThis.localStorage;
}

export type StoredAuthV1 = {
  accessToken: string;
  refreshToken: string;
  userRole?: string | null;
  updatedAt: number;
};

export const authStorage = {
  get(): StoredAuthV1 | null {
    const s = getStorage();
    return safeParse<StoredAuthV1>(s.getItem(AUTH_OBJECT_KEY));
  },
  set(payload: StoredAuthV1): boolean {
    const s = getStorage();
    try {
      s.setItem(AUTH_OBJECT_KEY, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  },
  clear(): boolean {
    const s = getStorage();
    try {
      s.removeItem(AUTH_OBJECT_KEY);
      return true;
    } catch {
      return false;
    }
  },
};

export const jwtStorage = {
  setTokens(accessToken: string, refreshToken: string): boolean {
    try {
      const s = getStorage();
      s.setItem(ACCESS_TOKEN_KEY, accessToken);
      s.setItem(REFRESH_TOKEN_KEY, refreshToken);
      authStorage.set({ accessToken, refreshToken, userRole: extractUserRole(accessToken), updatedAt: Date.now() });
      return true;
    } catch {
      return false;
    }
  },

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    try {
      const s = getStorage();
      const obj = authStorage.get();
      if (obj?.accessToken && obj?.refreshToken) {
        return { accessToken: obj.accessToken, refreshToken: obj.refreshToken };
      }
      return {
        accessToken: s.getItem(ACCESS_TOKEN_KEY),
        refreshToken: s.getItem(REFRESH_TOKEN_KEY),
      };
    } catch {
      return { accessToken: null, refreshToken: null };
    }
  },

  clearTokens(): boolean {
    try {
      const s = getStorage();
      s.removeItem(ACCESS_TOKEN_KEY);
      s.removeItem(REFRESH_TOKEN_KEY);
      authStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  hasTokens(): boolean {
    try {
      const obj = authStorage.get();
      if (obj?.accessToken && obj?.refreshToken) return true;
      const s = getStorage();
      return !!(s.getItem(ACCESS_TOKEN_KEY) && s.getItem(REFRESH_TOKEN_KEY));
    } catch {
      return false;
    }
  }
};

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
  const { accessToken, refreshToken } = jwtStorage.getTokens();
  
  if (!accessToken || !refreshToken) {
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  if (!isTokenValid(accessToken)) {
    jwtStorage.clearTokens();
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  const userRole = extractUserRole(accessToken);
  if (!userRole || userRole !== 'manager') {
    jwtStorage.clearTokens();
    return { isValid: false, accessToken: null, refreshToken: null, userRole: null };
  }

  return { isValid: true, accessToken, refreshToken, userRole };
}

export function isTokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= thresholdSeconds;
}
