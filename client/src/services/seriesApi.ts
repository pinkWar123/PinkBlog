import {
  IBackendRes,
  IPagination,
  ISeries,
  IUpdateResponse,
} from "../types/backend";
import { CreateSeriesDto } from "../types/dtos";
import axiosInstance from "./config";

export const fetchSeriesWithPagination = async (
  current: number = 1,
  pageSize: number = 10,
  qs?: string
) => {
  let query = `series?current=${current}&pageSize=${pageSize}`;
  if (qs) query += "&" + qs;
  return await axiosInstance.get<IBackendRes<IPagination<ISeries>>>(query);
};

export const fetchSeriesById = async (id: string) => {
  return await axiosInstance.get<IBackendRes<ISeries>>(`/series/${id}`);
};

export const createNewSeries = async (createSeriesDto: CreateSeriesDto) => {
  return await axiosInstance.post<IBackendRes<ISeries>>(
    "/series",
    createSeriesDto
  );
};

export const addPostsToSeries = async (id: string, postIds: string[]) => {
  return await axiosInstance.post<IBackendRes<IUpdateResponse>>(
    `/series/${id}/add-posts`,
    {
      postIds,
    }
  );
};

export const removePostFromSeries = async (id: string, postIds: string[]) => {
  return await axiosInstance.post<IBackendRes<IUpdateResponse>>(
    `/series/${id}/remove-posts`,
    { postIds }
  );
};
