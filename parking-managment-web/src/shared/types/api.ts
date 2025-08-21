export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errorCode: string | null;
  errors: string[] | null;
  timestamp: string | null;
  path: string | null;
}
