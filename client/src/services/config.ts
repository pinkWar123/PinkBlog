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

let modalShown = false;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    // Edit response config
    return response;
  },
  (error) => {
    console.log(error);
    // if (!modalShown && error.response.status === 401) {
    //   modalShown = true;
    //   // Unauthorized error: show modal to prompt user to log in
    //   Modal.error({
    //     title: "Unauthorized",
    //     content: "Please log in to access this content.",
    //     onOk: () => {
    //       modalShown = false;
    //       globalNavigate("/auth/login");
    //       // Redirect user to login page or perform any other action
    //     },
    //   });
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
