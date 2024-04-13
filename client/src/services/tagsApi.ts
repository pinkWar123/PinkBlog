import { IBackendRes, IPagination, ITag } from "../types/backend";
import axiosInstance from "./config";

const getTagsByRegex = async (search: string, number: number) => {
  return axiosInstance.get<IBackendRes<IPagination<ITag>>>(
    `/tags?value=/^${search}/&pageSize=${number}`
  );
};

export { getTagsByRegex };
