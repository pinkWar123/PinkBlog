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
