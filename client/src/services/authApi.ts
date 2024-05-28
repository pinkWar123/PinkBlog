import { AxiosResponse } from "axios";
import { UserLoginDto, UserRegisterDto } from "../types/auth";
import axiosInstance from "./config";
import { IBackendRes, IUpdateResponse, IUser } from "../types/backend";

const login = async (userLoginDto: UserLoginDto) => {
  try {
    const res: AxiosResponse<IBackendRes<IUser>> = await axiosInstance.post(
      "/auth/login",
      userLoginDto
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

const register = async (userRegisterDto: UserRegisterDto | undefined) => {
  try {
    const res = await axiosInstance.post<IBackendRes<IUser>>(
      "/auth/register",
      userRegisterDto
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const checkUserAccount = async (username: string) => {
  return axiosInstance.get<IBackendRes<string>>(
    `/auth/check-account/${username}`
  );
};

const getUserInfo = async () => {
  try {
    const res = await axiosInstance.get<IBackendRes<IUser>>("auth/account");
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const logout = async () => {
  return await axiosInstance.post<IBackendRes<IUpdateResponse>>("/auth/logout");
};

export default login;
export { checkUserAccount, register, getUserInfo, logout };
