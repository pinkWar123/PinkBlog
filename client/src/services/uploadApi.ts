import { AxiosResponse } from "axios";
import { IBackendRes, PublicFile } from "../types/backend";
import axiosInstance from "./config";

const uploadSingleFile = async (
  file: File,
  folder_type: string = "default",
  config?: any
) => {
  console.log(file);
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  try {
    const res: AxiosResponse<IBackendRes<PublicFile>> =
      await axiosInstance.post("/upload", bodyFormData, {
        ...config,
        headers: {
          folder_type: folder_type,
          "Content-Type": "multipart/form-data",
        },
      });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export { uploadSingleFile };
