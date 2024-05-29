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

export interface CreatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
  access?: "public" | "private";
}

export interface UpdatePostDto extends CreatePostDto {
  status?: "PENDING" | "REJECTED" | "APPROVED";
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

export interface UpdatePermissionDto extends CreatePermissionDto {}

export interface CreateSeriesDto {
  title: string;
  description: string;
  posts?: string[];
  tags?: string[];
  status?: string;
  access: string;
}
