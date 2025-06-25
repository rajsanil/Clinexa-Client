// src/types/permission.types.ts

export interface Permission {
  key: string;
  label: string;
}

export interface Screen {
  name: string;
  label: string;
  permissions: Permission[];
}

export interface PermissionCategory {
  name: string;
  label: string;
  screens: Screen[];
}

export interface PermissionsResponse {
  categories: PermissionCategory[];
}

export interface AssignPermissionsRequest {
  roleName: string;
  permissions: string[];
}

export interface AssignPermissionsResponse {
  success: boolean;
  message?: string;
  error?: string[];
}
