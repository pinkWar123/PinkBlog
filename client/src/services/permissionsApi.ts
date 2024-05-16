import { IBackendRes, IGroupedPermission } from "../types/backend";
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
