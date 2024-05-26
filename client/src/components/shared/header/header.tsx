import {
  EditFilled,
  EditOutlined,
  FileOutlined as FileOutlinedAntd,
  HistoryOutlined,
  InfoOutlined,
  LoginOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Popover, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import styles from "./header.module.scss";
import UserStateContext from "../../../context/users/UserContext";
import { useNavigate } from "react-router-dom";

type avatarPopoverProp = {
  icon: React.ReactElement;
  label: string;
  onClick?: () => void;
};

const AvatarPopoverContent: React.FC<{ props: avatarPopoverProp[] }> = ({
  props,
}) => {
  if (!props || props.length === 0) return <></>;
  return (
    <ul className={styles["container"]}>
      {props.map((prop, index) => {
        return (
          <div onClick={prop.onClick}>
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
          </div>
        );
      })}
    </ul>
  );
};

const MainHeader: React.FC = () => {
  const { user } = useContext(UserStateContext);
  const navigate = useNavigate();
  const writingPopoverProps: avatarPopoverProp[] = [
    {
      icon: <EditFilled />,
      label: "Viết bài",
      onClick: () => navigate(`/edit`),
    },
    {
      icon: <UnorderedListOutlined />,
      label: "Series mới",
      onClick: () => navigate(`/series/create`),
    },
  ];
  const avatarPopoverProps: avatarPopoverProp[] = [
    {
      icon: <UserOutlined />,
      label: "Trang cá nhân",
      onClick: () => navigate(`/profile/${user?._id}`),
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
          <>
            <div style={{ padding: "0 12px", cursor: "pointer" }}>
              <Popover
                content={<AvatarPopoverContent props={writingPopoverProps} />}
                trigger="click"
              >
                <EditOutlined />
              </Popover>
            </div>
            <div style={{ padding: "0 12px", cursor: "pointer" }}>
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
                    // crossOrigin="anonymous"
                    src={`${user.profileImageUrl}`}
                  />
                ) : (
                  <Avatar>{user.username}</Avatar>
                )}
              </Popover>
            </div>
          </>
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
