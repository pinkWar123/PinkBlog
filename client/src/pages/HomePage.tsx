import { Button, ConfigProvider, Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../styles/content-nav.module.scss";
import { PostItem } from "../components/shared";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchPublicPosts } from "../services/postsApi";
import { IPost } from "../types/backend";
import TabPane from "antd/es/tabs/TabPane";

const onChange = (key: string) => console.log(key);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetchPublicPosts();
      console.log(res);
      setPosts(res?.data.data?.result ?? []);
    };
    fetchPosts();
  }, []);
  console.log(posts);
  const items: TabsProps["items"] = [
    {
      key: "content-creator",
      label: "NHÀ SÁNG TẠO NỘI DUNG",
      children: (
        <div style={{ width: "100%" }}>
          {posts.length > 0 &&
            posts.map((post: IPost, index: number) => {
              return (
                <PostItem
                  tags={post.tags}
                  createdAt={post.createdAt}
                  createdBy={post.createdBy}
                  title={post.title}
                  key={index}
                  onClick={(e) => navigate(`/posts/${post._id}`)}
                />
              );
            })}
        </div>
      ),
    },
    {
      key: "following",
      label: "ĐANG THEO DÕI",
      children: <div>"Following"</div>,
    },
    {
      key: "latest",
      label: "MỚI NHẤT",
      children: <div style={{ textAlign: "left" }}>"Latest"</div>,
    },
    {
      key: "series",
      label: "SERIES",
      children: <div style={{ textAlign: "left" }}>"Series"</div>,
    },
    {
      key: "post",
      label: (
        <Button
          style={{ backgroundColor: "red" }}
          shape="round"
          icon={<EditOutlined />}
          size="middle"
          onClick={() => navigate("/posts")}
        >
          Viết bài
        </Button>
      ),
      children: <div style={{ textAlign: "left" }}>"Series"</div>,
    },
  ];
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: "var(--content-nav-background)",
              horizontalItemGutter: 12,
            },
          },
        }}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          // className={styles["nav"]}
          style={{ width: "100%" }}
          centered
        >
          {items.map((item, index) => (
            <TabPane tab={item.label} key={item.key} style={{ width: "100%" }}>
              {item.children}
            </TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
    </>
  );
};

export default HomePage;
