export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IPagination<T> {
  meta: {
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
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

export interface ITag {
  value: string;
  _id: string;
}

export interface IPost {
  _id: string;
  title: string;
  content?: string;
  tags: ITag[];
  createdBy: {
    username: string;
    _id: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
