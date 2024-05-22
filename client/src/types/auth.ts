export type UserLoginDto = {
  username: string;
  password: string;
};

export interface UserRegisterDto {
  username: string;
  password: string;
  email?: string;
  description?: string;
  age: number;
  profileImageUrl?: string;
  role?: string;
}

export type User = {
  username: string;
  _id: string;
  //role
};
