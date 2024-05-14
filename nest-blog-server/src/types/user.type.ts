export type IUser = {
  _id: string;
  username: string;
  password: string;
  name: string;
  profileImageUrl?: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
    method: string;
  }[];
};
