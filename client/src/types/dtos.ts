export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
  description?: string;
  age: number;
  profileImageUrl?: string;
  role: string;
}

export interface CreateTagDto {
  value: string;
  color: string;
  description?: string;
  image?: File;
}

export interface UpdateTagDto extends CreateTagDto {}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
  permissions: string[];
}

export interface UpdateRoleDto extends CreateRoleDto {}

export interface UpdatePostDto {
  status: "PENDING" | "REJECTED" | "APPROVED";
}

export interface CreatePermissionDto {
  name: string;
  module:
    | "ROLES"
    | "COMMENTS"
    | "PERMISSIONS"
    | "UPLOAD"
    | "POSTS"
    | "USERS"
    | "TAGS";
  apiPath: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
}
