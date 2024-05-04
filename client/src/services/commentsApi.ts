import { Modal } from "antd";
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

const upvote = async (_id: string) => {
  try {
    const res = await axiosInstance.post<IBackendRes<{ likes: number }>>(
      "comments/upvote",
      { _id }
    );
    return res;
  } catch (error: Error | any) {
    console.log(error);
    Modal.error({
      title: error.response.data.message,
    });
    return null;
  }
};

const downvote = async (_id: string) => {
  try {
    const res = await axiosInstance.post<IBackendRes<{ likes: number }>>(
      "comments/downvote",
      { _id }
    );
    return res;
  } catch (error: Error | any) {
    console.log(error);
    Modal.error({
      title: error.response.data.message,
    });
    return null;
  }
};

export {
  createComment,
  fetchCommentsOfPost,
  fetchListOfCommentsByIds,
  upvote,
  downvote,
};
