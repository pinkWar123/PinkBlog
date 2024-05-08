import { Modal } from "antd";
import { IBackendRes, IPagination, IPost } from "../types/backend";
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
      title: error?.message,
    });
  }
};

const fetchPublicPosts = async (current: number = 0, pageSize: number = 10) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
      "posts?populate=createdBy,tags",
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

const fetchLatestPosts = async (current: number = 0, pageSize: number = 10) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IPost>>>(
      "posts?sort=-createdAt",
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
      `posts?createdBy=${authorId}&current=${current}&pageSize=${pageSize}`
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

export {
  createPost,
  fetchPublicPosts,
  fetchPostById,
  fetchLatestPosts,
  fetchPostsByAuthorId,
  upvote,
  downvote,
};
