import {
  IBackendRes,
  IPagination,
  ITag,
  IUpdateResponse,
  PublicFile,
} from "../types/backend";
import { CreateTagDto, UpdateTagDto } from "../types/dtos";
import axiosInstance from "./config";

const getTagById = async (id: string) => {
  return await axiosInstance.get<IBackendRes<ITag>>(`/tags/${id}`);
};

const getTagsByRegex = async (search: string, number: number) => {
  return await axiosInstance.get<IBackendRes<IPagination<ITag>>>(
    `/tags?pageSize=${number}&current=1&value=/^${search}/i`
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

const fetchTagsWithPagination = async (qs?: string) => {
  try {
    return await axiosInstance.get<IBackendRes<IPagination<ITag>>>(
      `/tags?${qs}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createNewTag = async (value: CreateTagDto) => {
  try {
    const bodyFormData = new FormData();
    if (value?.image) bodyFormData.append("file", value?.image);
    Object.entries(value)?.forEach(([key, value]) => {
      if (key && value) bodyFormData.append(key, value);
    });
    return await axiosInstance.post<IBackendRes<ITag>>("/tags", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const uploadTagImage = async (id: string, file?: File) => {
  const bodyFormData = new FormData();
  if (file) bodyFormData.append("file", file);
  return await axiosInstance.post<IBackendRes<PublicFile>>(
    `/tags/${id}/image`,
    bodyFormData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

const updateTagById = async (id: string, value: UpdateTagDto, file?: File) => {
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
  getTagById,
  getTagsByRegex,
  getTagByValue,
  fetchTagsWithPagination,
  createNewTag,
  uploadTagImage,
  updateTagById,
  deleteTagById,
};
