import { Layout } from "antd";
import { MainHeader } from "../components/shared";
import { Outlet } from "react-router-dom";

const WithHeaderLayout: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <MainHeader />
      <div style={{ width: "95%", margin: "0 auto" }}>
        <Outlet />
      </div>
    </Layout>
  );
};

export default WithHeaderLayout;
