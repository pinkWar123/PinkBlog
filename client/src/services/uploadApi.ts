import { AxiosResponse } from "axios";
import { IBackendRes } from "../types/backend";
import axiosInstance from "./config";

const uploadSingleFile = async (file: any, config: any) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  try {
    const res: AxiosResponse<IBackendRes<{ fileName: string }>> =
      await axiosInstance.post("/upload", bodyFormData, config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export { uploadSingleFile };
