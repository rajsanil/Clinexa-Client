export interface AuthUser {
  userName: string;
  role: string;
  isLockedOut: boolean;
  isNotAllowed: boolean;
  requiresTwoFactor: boolean;
}

export interface AuthResponse {
  result: boolean;
  token: string;
  username: string;
  isLockedOut: boolean;
  isNotAllowed: boolean;
  requiresTwoFactor: boolean;
  error: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}
