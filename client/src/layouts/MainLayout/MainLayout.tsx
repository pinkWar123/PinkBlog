import React, { ReactElement, ReactNode, useContext, useEffect } from "react";
import {
  Layout,
  Flex,
  MenuProps,
  Menu,
  Space,
  Switch,
  Avatar,
  Popover,
} from "antd";
import { Outlet } from "react-router-dom";
import { MainHeader } from "../../components/shared";
import styles from "./MainLayout.module.scss";
import UserStateContext from "../../context/users/UserContext";
import { getUserInfo } from "../../services/authApi";
const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  // backgroundColor: "#0958d9",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(50% - 8px)",
  maxWidth: "calc(50% - 8px)",
};

const MainLayout: React.FC = () => {
  const { user, setUser } = useContext(UserStateContext);
  console.log(user);
  return (
    <Layout className={styles["layout"]}>
      <MainHeader />
      <Layout>
        <Content>
          <Outlet />
        </Content>
        <Sider width="25%" style={siderStyle} className={styles["sider"]}>
          Sider
        </Sider>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
};

export default MainLayout;
