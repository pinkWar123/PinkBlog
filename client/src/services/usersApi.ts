import {
  IBackendRes,
  IFollower,
  IPagination,
  IUpdateResponse,
  IUser,
} from "../types/backend";
import axiosInstance from "./config";

const fetchUser = async () => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const res = await axiosInstance.get("/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const fetchUsersWithPagination = async (
  current: number = 1,
  pageSize: number = 5
) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IUser>>>(
      `/users?current=${current}&pageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserById = async (id: string, visitorId?: string) => {
  try {
    const uri = visitorId
      ? `/users/${id}?visitorId=${visitorId}`
      : `/users/${id}`;
    const res = await axiosInstance.get<IBackendRes<IUser>>(uri);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const handleFollowUserById = async (
  targetUserId: string,
  currentUserId: string
) => {
  try {
    const res = await axiosInstance.post<IBackendRes<{ isFollowed: boolean }>>(
      `/users/follow/${targetUserId}`,
      { _id: currentUserId }
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchFollowersOfUserById = async (
  targetUserId: string,
  current: number = 0,
  pageSize: number = 5
) => {
  try {
    const res = await axiosInstance.get<IBackendRes<IPagination<IFollower>>>(
      `/users/${targetUserId}/followers?current=${current}&pageSize=${pageSize}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateUserById = async (id: string, createUserDto: IUser) => {
  const res = await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
    `/users/${id}`,
    createUserDto
  );
  return res;
};

const deleteUserById = async (id: string) => {
  console.log(id);
  try {
    const res = await axiosInstance.delete<IBackendRes<{ deleted: number }>>(
      `/users/${id}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  fetchUser,
  fetchUsersWithPagination,
  getUserById,
  fetchFollowersOfUserById,
  handleFollowUserById,
  updateUserById,
  deleteUserById,
};
