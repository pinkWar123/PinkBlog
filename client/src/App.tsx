import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts";
import NotFound from "./components/shared/not-found";
import "./App.css";
import { Auth, Post, Register } from "./pages";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
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
