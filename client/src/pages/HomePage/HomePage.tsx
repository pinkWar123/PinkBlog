import { Button, ConfigProvider, Tabs, TabsProps } from "antd";
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const onChange = (key: string) => navigate(`/${key}`);
  const items: TabsProps["items"] = [
    {
      key: "content-creator",
      label: "NHÀ SÁNG TẠO NỘI DUNG",
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
              {/* {item.children} */}
            </TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
      <Outlet />
      {/* <div
        style={{
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Space>
          <div>Nhà sáng tạo nội dung</div>
          <div>Đang theo dõi</div>
          <div>Mới nhất</div>
          <div>Series</div>
        </Space>
      </div> */}
    </>
  );
};

export default HomePage;
