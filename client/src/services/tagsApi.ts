import {
  IBackendRes,
  IPagination,
  ITag,
  IUpdateResponse,
} from "../types/backend";
import { CreateTagDto, UpdateTagDto } from "../types/dtos";
import axiosInstance from "./config";

const getTagsByRegex = async (search: string, number: number) => {
  return axiosInstance.get<IBackendRes<IPagination<ITag>>>(
    `/tags?value=/^${search}/&pageSize=${number}`
  );
};

const getTagByValue = async (value: string) => {
  try {
    return await axiosInstance.get<IBackendRes<IPagination<ITag>>>(
      `/tags?value=${value}&current=1&pageSize=10`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchTagsWithPagination = async (
  current: number = 1,
  pageSize: number = 10
) => {
  try {
    return await axiosInstance.get<IBackendRes<IPagination<ITag>>>(
      `/tags?current=${current}&pageSize=${pageSize}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createNewTag = async (value: CreateTagDto) => {
  try {
    return await axiosInstance.post<IBackendRes<ITag>>("/tags", value);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateTagById = async (id: string, value: UpdateTagDto) => {
  try {
    return await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
      `/tags/${id}`,
      value
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteTagById = async (id: string) => {
  try {
    return await axiosInstance.delete<IBackendRes<{ deleted: number }>>(
      `/tags/${id}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  getTagsByRegex,
  getTagByValue,
  fetchTagsWithPagination,
  createNewTag,
  updateTagById,
  deleteTagById,
};
