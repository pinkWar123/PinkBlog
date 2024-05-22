import { IBackendRes, IGroupedPermission, IPermission } from "../types/backend";
import { CreatePermissionDto } from "../types/dtos";
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
  return await axiosInstance.post<IBackendRes<IPermission[]>>(
    "/permissions",
    createPermissionDto
  );
};
