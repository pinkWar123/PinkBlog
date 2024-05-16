import {
  IBackendRes,
  IPagination,
  IRole,
  ISingleRole,
  IUpdateResponse,
} from "../types/backend";
import { CreateRoleDto, UpdateRoleDto } from "../types/dtos";
import axiosInstance from "./config";

export const fetchRoles = async () => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IRole>>>(
      `/roles?current=1&pageSize=10`
    );
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchRolesByName = async (name: string) => {
  try {
    return await axiosInstance.get<IBackendRes<IPagination<IRole>>>(
      `/roles?current=1&pageSize=10&name=${name}`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchRoleById = async (id: string) => {
  try {
    return await axiosInstance.get<IBackendRes<ISingleRole>>(`roles/${id}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateRoleById = async (id: string, value: UpdateRoleDto) => {
  try {
    return await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
      `/roles/${id}`,
      value
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createNewRole = async (value: CreateRoleDto) => {
  return await axiosInstance.post<IBackendRes<IRole>>("/roles", value);
};

export const deleteRoleById = async (id: string) => {
  return await axiosInstance.delete<IBackendRes<{ deleted: number }>>(
    `/roles/${id}`
  );
};
