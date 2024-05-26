import { AxiosError } from "axios";

export interface IBackendRes<T> {
  error?: {
    message: string;
  };
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

export interface IUpdateResponse {
  acknowledge: boolean;
  modifiedCount: number;
  upsertedId: string;
  upsertedCount: number;
  matchedCount: number;
}

export interface IUser {
  accessToken?: string;
  age: number;
  _id: string;
  username: string;
  description?: string;
  sub?: string;
  iat?: string;
  profileImageUrl?: string;
  isFollowed?: boolean;
  numOfFollowers: number;
  reputation: number;
  numOfPosts: number;
  role: {
    _id: string;
    name: string;
  };
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
  createdAt: Date;
  color: string;
  description?: string;
  image?: PublicFile;
}

export interface IPost {
  _id: string;
  title: string;
  content?: string;
  likes: number;
  tags: ITag[];
  createdBy: {
    username: string;
    _id: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface IComment {
  _id: string;
  parentId: {
    createdBy: {
      username: string;
      _id: string;
      profileImageUrl?: string;
    };
  } | null;
  childrenIds: string[];
  children: IComment[] = [];
  content: string;
  likes: number;
  createdBy: {
    username: string;
    _id: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMeta {
  total: number;
  current: number;
  pageSize: number;
  pages: number;
}

export interface IFollower {
  _id: string;
  username: string;
  numOfPosts: number;
  numOfFollowers: number;
  reputation: number;
  profileImageUrl: string;
}

export interface IPermission {
  _id: string;
  apiPath: string;
  name: string;
  method: "GET" | "PUT" | "POST" | "DELETE" | "PATCH";
  module: string;
  createdAt: Date;
}

export interface IRole {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
}

export interface ISingleRole {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[];
}

export interface IGroupedPermission {
  _id: string;
  permissions: IPermission[];
}

export interface PublicFile {
  url: string;
  key?: string;
}

export interface ISeries {
  _id: string;
  title: string;
  description: string;
  posts: IPost[];
  tags: ITag[];
  access: string;
  viewCount: number;
  createdBy: IUser;
  createdAt: Date;
}
