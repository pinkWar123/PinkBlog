import { Modal } from "antd";
import { IBackendRes, IPost } from "../types/backend";
import axiosInstance from "./config";

const createPost = async (
  title: string,
  content: string,
  tags: string[],
  access: string
) => {
  try {
    const res = await axiosInstance.post<IBackendRes<IPost>>("posts", {
      title,
      content,
      tags,
      access,
    });
    return res;
  } catch (error: Error | any) {
    console.log(error);
    Modal.error({
      title: error.message,
    });
  }
};

export { createPost };
