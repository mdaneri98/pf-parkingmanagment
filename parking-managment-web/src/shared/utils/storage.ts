const STORAGE_PREFIX = 'pmw:';

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

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  userRole: string | null;
  updatedAt: number;
};

export const appStorage = {
  // Auth management
  setAuth(accessToken: string, refreshToken: string, userRole: string | null): boolean {
    try {
      const s = getStorage();
      const authData: AuthData = {
        accessToken,
        refreshToken,
        userRole,
        updatedAt: Date.now()
      };
      s.setItem(`${STORAGE_PREFIX}auth:v1`, JSON.stringify(authData));
      return true;
    } catch {
      return false;
    }
  },

  getAuth(): AuthData | null {
    const s = getStorage();
    return safeParse<AuthData>(s.getItem(`${STORAGE_PREFIX}auth:v1`));
  },

  clearAuth(): boolean {
    try {
      const s = getStorage();
      s.removeItem(`${STORAGE_PREFIX}auth:v1`);
      return true;
    } catch {
      return false;
    }
  },

  hasAuth(): boolean {
    const auth = this.getAuth();
    return !!(auth?.accessToken && auth?.refreshToken);
  },

  // Parking lot selection
  setSelectedParkingLotId(lotId: number): boolean {
    try {
      const s = getStorage();
      s.setItem(`${STORAGE_PREFIX}selectedParkingLotId`, String(lotId));
      return true;
    } catch {
      return false;
    }
  },

  getSelectedParkingLotId(): number | null {
    try {
      const s = getStorage();
      const stored = s.getItem(`${STORAGE_PREFIX}selectedParkingLotId`);
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  },

  clearSelectedParkingLotId(): boolean {
    try {
      const s = getStorage();
      s.removeItem(`${STORAGE_PREFIX}selectedParkingLotId`);
      return true;
    } catch {
      return false;
    }
  },

  // General purpose storage with automatic prefixing
  set(key: string, value: any): boolean {
    try {
      const s = getStorage();
      const prefixedKey = key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
      s.setItem(prefixedKey, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  get<T>(key: string): T | null {
    try {
      const s = getStorage();
      const prefixedKey = key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
      return safeParse<T>(s.getItem(prefixedKey));
    } catch {
      return null;
    }
  },

  remove(key: string): boolean {
    try {
      const s = getStorage();
      const prefixedKey = key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
      s.removeItem(prefixedKey);
      return true;
    } catch {
      return false;
    }
  },

  // Clear all app data
  clearAll(): boolean {
    try {
      const s = getStorage();
      const keys = Object.keys(s);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          s.removeItem(key);
        }
      });
      return true;
    } catch {
      return false;
    }
  }
};
