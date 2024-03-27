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

export { fetchUser };
