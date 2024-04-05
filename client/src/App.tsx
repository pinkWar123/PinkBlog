import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts";
import NotFound from "./components/shared/not-found";
import "./App.css";
import { Auth, Post, Register } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import { useContext, useEffect } from "react";
import UserStateContext from "./context/users/UserContext";
import { getUserInfo } from "./services/authApi";
import { GlobalHistory } from "./components/shared/global-history";

export default function App() {
  const { user, setUser } = useContext(UserStateContext);
  useEffect(() => {
    const fetchUserRes = async () => {
      const res = await getUserInfo();
      if (res?.status === 200) {
        setUser(res.data.data);
      }
    };
    fetchUserRes();
    console.log(user);
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Post />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { path: "/auth", element: <Auth /> },
        { path: "/auth/register", element: <Register /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
