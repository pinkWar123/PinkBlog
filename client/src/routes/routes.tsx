import { MainLayout } from "../layouts";
import { Home } from "../pages/home";

interface routesProps {
  path: string;
  component: React.ReactNode;
}

export const publicRoutes: [routesProps] = [
  {
    path: "/",
    component: <Home />,
  },
];

export const privateRoutes: [routesProps | {}] = [{}];
