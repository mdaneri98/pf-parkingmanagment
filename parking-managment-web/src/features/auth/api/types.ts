export interface JWTPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface RoleValidationResult {
  isValid: boolean;
  role: string | null;
  error: string | null;
}
