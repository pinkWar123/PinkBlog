import { Avatar, Button, Col, Divider, Layout, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import UserStateContext from "../../context/users/UserContext";
import { getUserById, handleFollowUserById } from "../../services/usersApi";
import { IUser } from "../../types/backend";
import { MainHeader } from "../../components/shared";
import styles from "./ProfileLayout.module.scss";
import classNames from "classnames/bind";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const cx = classNames.bind(styles);

const profileTabs = [
  {
    title: "Bài viết",
    url: "",
  },
  {
    title: "Series",
    url: "series",
  },
  {
    title: "Người theo dõi",
    url: "followers",
  },
];

const ProfileLayout: React.FC = () => {
  const { id } = useParams();
  const [member, setMember] = useState<IUser | undefined>();
  const { user } = useContext(UserStateContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      const res = await getUserById(id, user?._id);
      if (res && res.status === 200) {
        setMember(res.data.data);
      }
    };
    fetchMember();
  }, [id, user?._id]);
  const handleFollowUser = async () => {
    if (!id || !user?._id) return;
    const res = await handleFollowUserById(id, user?._id);
    if (res && res.status === 201) {
      setMember((prev) => {
        if (!prev) return prev;
        return { ...prev, isFollowed: res.data.data?.isFollowed };
      });
    }
  };
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <div style={{ minHeight: "100vh" }}>
        <MainHeader />

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            height: "120px",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar src={member?.profileImageUrl} size={70} />
            <div style={{ marginLeft: "18px" }}>
              <div style={{ fontSize: "20px" }}>{member?.username}</div>
            </div>
          </div>
          <div>
            <Button type="primary" onClick={handleFollowUser}>
              {member?.isFollowed ? "Hủy theo dõi" : "Theo dõi"}
            </Button>
          </div>
        </div>
        <Divider />
        <div>
          <Row
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {profileTabs.map((tab, index) => (
              <Col
                key={index}
                span={24 / profileTabs.length}
                className={cx("tab", {
                  active: true,
                })}
                onClick={() => navigate(`./${tab.url}`)}
              >
                {tab.title}
              </Col>
            ))}
          </Row>
        </div>
        <Row
          style={{
            width: "100%",
            display: "flex",
            justifyItems: "center",
            marginTop: "40px",
          }}
        >
          <Col span={2}></Col>
          <Col
            xl={17}
            lg={17}
            md={22}
            style={{ display: "flex", justifyItems: "center" }}
          >
            <Outlet />
          </Col>
          <Col xl={4} lg={4} md={0}>
            <div className={styles["stat-wrapper"]}>
              <div className={styles["item"]}>
                <div>Tổng số lượt xem bài viết</div>
                <div>0</div>
              </div>
              <div className={styles["item"]}>
                <div>Reputation</div>
                <div>0</div>
              </div>
              <div className={styles["item"]}>
                <div>Bài viết</div>
                <div>0</div>
              </div>
              <div className={styles["item"]}>
                <div>Đang theo dõi</div>
                <div>0</div>
              </div>
              <div className={styles["item"]}>
                <div>Được theo dõi</div>
                <div>0</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default ProfileLayout;
