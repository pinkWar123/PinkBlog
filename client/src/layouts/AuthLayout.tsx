import { Outlet } from "react-router-dom";

interface IProps {
  children?: string | React.ReactElement;
}

export default function AuthLayout(props: IProps) {
  if (props.children) return <>{props.children}</>;
  return <Outlet />;
}
