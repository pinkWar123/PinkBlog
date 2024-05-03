import { IBackendRes, IComment, IPagination } from "../types/backend";
import axiosInstance from "./config";

const createComment = async (
  content: string,
  targetId: string,
  parentId?: string
) => {
  try {
    const res = await axiosInstance.post<IBackendRes<IComment>>("comments", {
      content,
      targetId,
      parentId,
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

const fetchListOfCommentsByIds = async (ids: string[]) => {
  try {
    const res = await axiosInstance.post<IBackendRes<IComment[]>>(
      "comments/multiple",
      ids
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createComment, fetchCommentsOfPost, fetchListOfCommentsByIds };
