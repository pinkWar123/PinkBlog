import { Auth, Post } from "../pages";

interface routesProps {
  path: string;
  component: React.ReactNode;
}

export const publicRoutes: routesProps[] = [
  {
    path: "/auth",
    component: <Auth />,
  },
  {
    path: "/",
    component: <Post />,
  },
];

export const privateRoutes: [routesProps | {}] = [{}];
