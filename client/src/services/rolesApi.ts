import { IBackendRes, IPagination, IRole } from "../types/backend";
import axiosInstance from "./config";

export const fetchRoles = async () => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IRole>>>(
      `/roles?current=1&pageSize=10`
    );
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
