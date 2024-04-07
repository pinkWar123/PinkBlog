export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IUser {
  accessToken?: string;
  _id: string;
  username: string;
  sub?: string;
  iat?: string;
  profileImageUrl?: string;
}

export interface IRegister {
  username: string;
  password: string;
  email?: string;
  age: number;
  description?: string;
}
