import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Layout,
  Flex,
  MenuProps,
  Menu,
  Space,
  Switch,
  Avatar,
  Popover,
  Divider,
} from "antd";
import { Outlet } from "react-router-dom";
import { MainHeader } from "../../components/shared";
import styles from "./MainLayout.module.scss";
import UserStateContext from "../../context/users/UserContext";
import { getUserInfo } from "../../services/authApi";
import { UserStateProvider } from "../../context";
import { IPost } from "../../types/backend";
import { fetchPublicPosts } from "../../services/postsApi";
import ShowTopPostsContext from "../../context/top-posts/ShowTopPostContext";
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
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  right: "2%",
  top: 140,
  bottom: 0,
  // marginLeft: "800px",
  backgroundColor: "transparent",
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
  const [topPosts, setTopPosts] = useState<IPost[] | undefined>([]);
  const { showTopPosts } = useContext(ShowTopPostsContext);
  useEffect(() => {
    const fetchTopPosts = async () => {
      const res = await fetchPublicPosts(0, 3);
      if (res?.status === 200) {
        setTopPosts(res.data.data?.result);
      }
    };
    fetchTopPosts();
  }, []);
  return (
    <Layout>
      <MainHeader />
      <Layout className={styles["layout"]}>
        <Layout>
          <Content>
            <Outlet />
          </Content>
        </Layout>
        {showTopPosts && (
          <Sider style={siderStyle} className={styles["sider"]} width="20%">
            <div style={{ display: "flex" }}>
              <div>Bài viết nổi bật</div>

              <div
                style={{
                  flex: 1,
                  border: "1px solid #eee",
                  height: "1px",
                  marginTop: "7px",
                }}
              ></div>
            </div>
            <div style={{ textAlign: "left", marginTop: "20px" }}>
              {topPosts &&
                topPosts.length > 0 &&
                topPosts.map((topPost) => (
                  <div>
                    <a
                      href={`http://localhost:3000/posts/${topPost._id}`}
                      style={{ lineHeight: "20px" }}
                    >
                      {topPost.title}
                    </a>
                  </div>
                ))}
            </div>
          </Sider>
        )}
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
};

export default MainLayout;
