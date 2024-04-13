import { Button, ConfigProvider, Tabs, TabsProps } from "antd";
import React from "react";
import styles from "../styles/content-nav.module.scss";
import { PostItem } from "../components/shared";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const onChange = (key: string) => console.log(key);

const Post: React.FC = () => {
  const navigate = useNavigate();
  const items: TabsProps["items"] = [
    {
      key: "content-creator",
      label: "NHÀ SÁNG TẠO NỘI DUNG",
      children: (
        <div>
          <PostItem />
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
          items={items}
          onChange={onChange}
          //className={styles["nav"]}
          centered
        />
      </ConfigProvider>
    </>
  );
};

export default Post;
