export interface Role {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string | null;
}

export interface RolesResponse {
  roles: Role[];
  error: string[];
}
