import { Modal } from "antd";
import axios from "axios";
import { createBrowserRouter } from "react-router-dom";
import { globalNavigate } from "../components/shared/global-history";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = "http://localhost:8000/api/v1";
axiosInstance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("access_token")}`;
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use(
  (request) => {
    console.log(request);
    // Edit request config
    return request;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    // Edit response config
    return response;
  },
  (error) => {
    console.log(error);
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default axiosInstance;
