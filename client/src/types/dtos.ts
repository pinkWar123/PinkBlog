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
}

export interface UpdateTagDto extends CreateTagDto {}

export interface CreateRoleDto {
  name: string;
  description?: string;
  isActive: boolean;
  permissions: string[];
}

export interface UpdateRoleDto extends CreateRoleDto {}
