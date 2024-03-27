import { AxiosResponse } from "axios";
import { UserLoginDto } from "../types/auth";
import axiosInstance from "./config";

const login = async (userLoginDto: UserLoginDto) => {
  const { username, password } = userLoginDto;
  try {
    const res: AxiosResponse = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export default login;
