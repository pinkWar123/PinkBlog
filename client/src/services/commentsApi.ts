import { IBackendRes, IComment, IPagination } from "../types/backend";
import axiosInstance from "./config";

const createRootComment = async (content: string, targetId: string) => {
  try {
    const res = await axiosInstance.post<IBackendRes<IComment>>("comments", {
      content,
      targetId,
    });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchCommentsOfPost = async (
  targetId: string,
  current: number,
  pageSize: number
) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IComment>>>(
      `comments/posts/${targetId}?current=${current}&pageSize=${pageSize}`,
      {}
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createRootComment, fetchCommentsOfPost };
