import { Modal } from "antd";
import {
  IBackendRes,
  IPagination,
  IPost,
  IUpdateResponse,
} from "../types/backend";
import axiosInstance from "./config";
import { UpdatePostDto } from "../types/dtos";

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
      title: error?.message,
    });
  }
};

const fetchPublicPosts = async () => {
  const res = await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
    "posts?populate=createdBy,tags&access=public"
  );
  return res;
};

const fetchPosts = async (qs?: string) => {
  return await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
    `posts?${qs ?? ""}`
  );
};

const fetchLatestPosts = async (current: number = 0, pageSize: number = 10) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
      "posts?sort=-createdAt&access=public&status=APPROVED",
      {
        params: {
          current,
          pageSize,
        },
      }
    );
    return res;
  } catch (error: Error | any) {
    console.log(error);
    Modal.error({
      title: error?.message,
    });
  }
};

const fetchPostById = async (id: string) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPost>>(`posts/${id}`);
    return res;
  } catch (error: Error | any) {
    console.log(error);
    Modal.error({
      title: error?.message,
    });
    return null;
  }
};

const fetchPostsByAuthorId = async (
  authorId: string,
  current: number = 0,
  pageSize: number = 10
) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
      `posts?createdBy=${authorId}&current=${current}&pageSize=${pageSize}&access=public&status=APPROVED`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchFollowingPosts = async (
  current: number = 1,
  pageSize: number = 5
) => {
  return await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
    `posts/following?current=${current}&pageSize=${pageSize}`
  );
};

const updatePostById = async (id: string, updatePostDto: UpdatePostDto) => {
  return await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
    `posts/${id}`,
    updatePostDto
  );
};

const upvote = async (_id: string) => {
  try {
    const res = await axiosInstance.post<IBackendRes<{ likes: number }>>(
      "posts/upvote",
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
      "posts/downvote",
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

const removePostById = async (id: string) => {
  return await axiosInstance.delete<IBackendRes<IUpdateResponse>>(
    `/posts/${id}`
  );
};

export {
  createPost,
  fetchPublicPosts,
  fetchPostById,
  fetchLatestPosts,
  fetchFollowingPosts,
  fetchPostsByAuthorId,
  updatePostById,
  fetchPosts,
  upvote,
  downvote,
  removePostById,
};
