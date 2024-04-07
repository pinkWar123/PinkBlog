import {
  FileDoneOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import styles from "./register.module.scss";
type IProps = {
  current: number;
};

export const items = [
  {
    title: "User information",
    description: "Please provide valid username and password",
    icon: <UserOutlined />,
  },
  {
    title: "Upload profile picture",
    description: "This is your profile picture",
    icon: <PictureOutlined />,
  },
  {
    title: "Finish",
    icon: <FileDoneOutlined />,
  },
];

const RegisterSteps: React.FC<IProps> = ({ current }) => {
  return (
    <Steps
      size="small"
      className={styles["step"]}
      current={current}
      items={items}
    />
  );
};

export default RegisterSteps;
