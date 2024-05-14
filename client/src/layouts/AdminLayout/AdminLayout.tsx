import { Layout } from "antd";
import { MainHeader } from "../../components/shared";
import Sider from "antd/es/layout/Sider";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";

const AdminLayout: React.FC = () => {
  return (
    <Layout>
      <div style={{ minHeight: "100vh" }}>
        <MainHeader />
        <Layout>
          <Sider>
            <Navigation />
          </Sider>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default AdminLayout;
