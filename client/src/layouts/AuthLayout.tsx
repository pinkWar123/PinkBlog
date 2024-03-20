interface IProps {
  children?: string | React.ReactElement;
}

export default function AuthLayout(props: IProps) {
  return <>{props.children}</>;
}
