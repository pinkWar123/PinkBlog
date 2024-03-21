import { ConfigProvider, Tabs, TabsProps } from "antd";
import React from "react";
import styles from "../styles/content-nav.module.scss";
import { PostItem } from "../components/shared";
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "NHÀ SÁNG TẠO NỘI DUNG",
    children: (
      <div style={{ textAlign: "left" }}>
        <PostItem />
      </div>
    ),
  },
  {
    key: "2",
    label: "ĐANG THEO DÕI",
    children: <div style={{ textAlign: "left" }}>"Following"</div>,
  },
  {
    key: "3",
    label: "MỚI NHẤT",
    children: <div style={{ textAlign: "left" }}>"Latest"</div>,
  },
  {
    key: "4",
    label: "SERIES",
    children: <div style={{ textAlign: "left" }}>"Series"</div>,
  },
];
const onChange = (key: string) => console.log(key);

const Post: React.FC = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: "var(--content-nav-background)",
              horizontalItemGutter: 32,
            },
          },
        }}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          className={styles["nav"]}
        />
      </ConfigProvider>
    </>
  );
};

export default Post;
