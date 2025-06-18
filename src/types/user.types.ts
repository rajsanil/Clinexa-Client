export interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
}

export interface UsersResponse {
  users: User[];
  error: string[];
}
