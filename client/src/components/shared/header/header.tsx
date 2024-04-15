import {
  FileOutlined as FileOutlinedAntd,
  HistoryOutlined,
  InfoOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuProps,
  Popover,
  Space,
  Switch,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import styles from "./header.module.scss";
import UserStateContext from "../../../context/users/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/auth";
import { getUserInfo } from "../../../services/authApi";
import { IUser } from "../../../types/backend";
import { UserStateProvider } from "../../../context";
const leftMenuItems: MenuProps["items"] = [
  {
    key: 0,
    label: "Bài viết",
  },
  {
    key: 1,
    label: "Hỏi đáp",
  },
];

type avatarPopoverProp = {
  icon: React.ReactElement;
  label: string;
};

const avatarPopoverProps: avatarPopoverProp[] = [
  {
    icon: <UserOutlined />,
    label: "Trang cá nhân",
  },
  {
    icon: <FileOutlinedAntd />,
    label: "Quản Lý nội dung",
  },
  {
    icon: <HistoryOutlined />,
    label: "Lịch sử hoạt động",
  },
  {
    icon: <LogoutOutlined />,
    label: "Đăng xuất",
  },
];

const AvatarPopoverContent: React.FC<{ props: avatarPopoverProp[] }> = ({
  props,
}) => {
  if (!props || props.length === 0) return <></>;
  return (
    <ul className={styles["container"]}>
      {props.map((prop, index) => {
        return (
          <>
            {index === props.length - 1 && (
              <Divider style={{ margin: "6px" }} />
            )}
            <li
              key={prop.label}
              style={{
                lineHeight: index === props.length - 1 ? "24px" : "36px",
              }}
              className={styles["item"]}
            >
              <div style={{}}>{prop.icon}</div>
              <div style={{ flex: 1 }}>
                <span style={{ marginLeft: "12px" }}>{prop.label}</span>
              </div>
            </li>
          </>
        );
      })}
    </ul>
  );
};

const MainHeader: React.FC = () => {
  // const [user, setUser] = useState<IUser | undefined>();
  // useEffect(() => {
  //   const fetchUserRes = async () => {
  //     const res = await getUserInfo();
  //     if (res?.status === 200) {
  //       const _user = res.data.data;
  //       console.log(_user);
  //       setUser(_user);
  //     }
  //     console.log(res?.data.data);
  //   };
  //   fetchUserRes();
  // }, []);
  const { user } = useContext(UserStateContext);
  const navigate = useNavigate();
  const renderRightMenuItems = () => {
    return [
      {
        key: `menu2-0`,
        label: <InfoOutlined />,
      },
      {
        key: "show-user",
        label: <Button onClick={() => console.log(user)}>Show user</Button>,
      },
      {
        key: `menu2-1`,
        label: <Switch />,
      },
      {
        key: `menu2-2`,
        label: (
          <>
            {user ? (
              <Popover
                content={
                  <AvatarPopoverContent
                    props={avatarPopoverProps}
                  ></AvatarPopoverContent>
                }
                trigger="click"
              >
                {user.profileImageUrl ? (
                  <Avatar
                    crossOrigin="anonymous"
                    src={`http://localhost:8000/public/images/profile/${user.profileImageUrl}`}
                  />
                ) : (
                  <Avatar>{user.username}</Avatar>
                )}
              </Popover>
            ) : (
              <div onClick={() => navigate("/auth")} style={{ width: "100%" }}>
                <LoginOutlined /> Log in{" "}
              </div>
            )}
          </>
        ),
      },
    ];
  };
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: "auto",
      }}
    >
      <Space size={"large"}>
        <div style={{ color: "red", paddingRight: "32px", flexShrink: "0" }}>
          Blogger
        </div>
        <div>Bài viết 1</div>
        <div>Hỏi đáp</div>
      </Space>
      <Space>
        {user ? (
          <Popover
            content={
              <AvatarPopoverContent
                props={avatarPopoverProps}
              ></AvatarPopoverContent>
            }
            trigger="click"
          >
            {user.profileImageUrl ? (
              <Avatar
                crossOrigin="anonymous"
                src={`http://localhost:8000/public/images/profile/${user.profileImageUrl}`}
              />
            ) : (
              <Avatar>{user.username}</Avatar>
            )}
          </Popover>
        ) : (
          <div onClick={() => navigate("/auth")} style={{ width: "100%" }}>
            <LoginOutlined /> Log in{" "}
          </div>
        )}
      </Space>
    </Header>
  );
};

export default MainHeader;
