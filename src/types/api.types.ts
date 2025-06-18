export interface BaseApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string[];
  message?: string;
  statusCode?: number;
}

export interface AuthResponse {
  result: boolean;
  token: string;
  username: string;
  role?: string;
}

// Generic API Error
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Request Config
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
