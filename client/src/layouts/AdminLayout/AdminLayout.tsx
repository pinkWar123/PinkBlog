import { Layout } from "antd";
import { MainHeader } from "../../components/shared";
import Sider from "antd/es/layout/Sider";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import AdminGuard from "../../components/admin/AdminGuard";

const AdminLayout: React.FC = () => {
  return (
    <AdminGuard>
      <Layout>
        <div style={{ minHeight: "100vh" }}>
          <MainHeader />
          <Layout>
            <Sider>
              <Navigation />
            </Sider>
            <Content style={{ padding: "24px" }}>
              <Outlet />
            </Content>
          </Layout>
        </div>
      </Layout>
    </AdminGuard>
  );
};

export default AdminLayout;
