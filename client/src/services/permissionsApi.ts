import {
  IBackendRes,
  IGroupedPermission,
  IPagination,
  IPermission,
  IUpdateResponse,
} from "../types/backend";
import { CreatePermissionDto, UpdatePermissionDto } from "../types/dtos";
import axiosInstance from "./config";

export const getGroupedPermissions = async () => {
  try {
    return await axiosInstance.get<IBackendRes<IGroupedPermission[]>>(
      "/permissions/grouped-by-module"
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createNewPermission = async (
  createPermissionDto: CreatePermissionDto
) => {
  return await axiosInstance.post<IBackendRes<IPermission>>(
    "/permissions",
    createPermissionDto
  );
};

export const fetchPermissionsWithPagination = async (qs?: string) => {
  return await axiosInstance.get<IBackendRes<IPagination<IPermission>>>(
    `/permissions?${qs ? qs : ""}`
  );
};

export const updatePermissionById = async (
  id: string,
  updatePermissionDto: UpdatePermissionDto
) => {
  return await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
    `/permissions/${id}`,
    updatePermissionDto
  );
};
