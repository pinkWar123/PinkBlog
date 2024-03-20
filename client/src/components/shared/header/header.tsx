import {
  FileOutlined as FileOutlinedAntd,
  HistoryOutlined,
  InfoOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Menu, MenuProps, Popover, Space, Switch } from "antd";
import { Header } from "antd/es/layout/layout";
import React from "react";
import styles from "./header.module.scss";
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

const rightMenuItems = [
  {
    key: `menu2-0`,
    label: <InfoOutlined />,
  },
  {
    key: `menu2-1`,
    label: <Switch />,
  },
  {
    key: `menu2-2`,
    label: (
      <Space wrap>
        <Popover
          content={
            <AvatarPopoverContent
              props={avatarPopoverProps}
            ></AvatarPopoverContent>
          }
          trigger="click"
        >
          <Avatar>User</Avatar>
        </Popover>
      </Space>
    ),
  },
];

const MainHeader = () => {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        width: "100%",
        margin: "auto",
      }}
    >
      <div style={{ color: "red", paddingRight: "64px" }}>Blogger</div>
      {/* <Space size="large" style={{ marginLeft: "50px" }}> */}
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["Bài viết"]}
        items={leftMenuItems}
        style={{ flex: 1, minWidth: 0 }}
      />

      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["Bài viết"]}
        items={rightMenuItems}
        style={{ minWidth: 0, margin: "auto" }}
      />
    </Header>
  );
};

export default MainHeader;
