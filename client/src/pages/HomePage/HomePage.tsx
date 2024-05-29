import { Button, ConfigProvider, Tabs, TabsProps, message } from "antd";
import React, { useContext } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import UserStateContext from "../../context/users/UserContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onChange = (key: string) => navigate(`/${key}`);
  const { user } = useContext(UserStateContext);
  const [messageApi, contextHolder] = message.useMessage();
  const items: TabsProps["items"] = [
    {
      key: "content-creator",
      label: (
        <div onClick={() => navigate("/content-creator")}>
          "NHÀ SÁNG TẠO NỘI DUNG"
        </div>
      ),
    },
    {
      key: "following",
      label: "ĐANG THEO DÕI",
      children: <div onClick={() => navigate("/following")}>"Following"</div>,
    },
    {
      key: "latest",
      label: "MỚI NHẤT",
      children: (
        <div style={{ textAlign: "left" }} onClick={() => navigate("/latest")}>
          "Latest"
        </div>
      ),
    },
    {
      key: "series",
      label: "SERIES",
      children: (
        <div style={{ textAlign: "left" }} onClick={() => navigate("/series")}>
          "Series"
        </div>
      ),
    },
    {
      key: "posts/create",
      label: (
        <Button
          style={{ backgroundColor: "red" }}
          shape="round"
          icon={<EditOutlined />}
          size="middle"
          onClick={() => {
            if (!user) {
              message.error({
                content: "You have to log in to use this feature",
              });
              return;
            }
          }}
        >
          Viết bài
        </Button>
      ),
      children: <div style={{ textAlign: "left" }}>"Series"</div>,
    },
  ];
  return (
    <>
      {contextHolder}
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
          defaultActiveKey={location.pathname.split("/").pop()}
          onChange={onChange}
          // className={styles["nav"]}
          style={{ width: "100%" }}
          centered
        >
          {items.map((item, index) => {
            if (
              (item.key === "following" || item.key === "posts/create") &&
              !user
            )
              return <></>;
            return (
              <TabPane
                tab={item.label}
                key={item.key}
                style={{ width: "100%" }}
              ></TabPane>
            );
          })}
        </Tabs>
      </ConfigProvider>
      <Outlet />
    </>
  );
};

export default HomePage;
