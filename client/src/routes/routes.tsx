import { Auth, HomePage } from "../pages";

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
    component: <HomePage />,
  },
];

export const privateRoutes: [routesProps | {}] = [{}];
