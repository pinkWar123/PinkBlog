import { useCallback, useEffect, useState } from "react";
import { IFollower } from "../../types/backend";
import PaginationHandler from "../../components/shared/PaginationHandler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchFollowersOfUserById } from "../../services/usersApi";
import { Avatar, Button, Col, Empty, Flex, Row, Tooltip } from "antd";
import { EditFilled, StarFilled, UserAddOutlined } from "@ant-design/icons";
import styles from "./ProfilePage.module.scss";
const followerStatItems = [
  {
    icon: <StarFilled />,
    title: "Reputation",
  },
  {
    icon: <UserAddOutlined />,
    title: "Followers",
  },
  {
    icon: <EditFilled />,
    title: "Posts",
  },
];
//<UserDeleteOutlined />
const FollowerItem: React.FC<{ follower: IFollower; onClick: () => void }> = ({
  follower,
  onClick,
}) => {
  return (
    <Flex style={{ padding: "20px 0" }}>
      <Avatar
        size={64}
        src={follower.profileImageUrl}
        style={{ cursor: "pointer" }}
        onClick={onClick}
      />
      <div style={{ marginLeft: "8px" }}>
        <div className={styles["follower-username"]} onClick={onClick}>
          {follower.username}
        </div>
        <Flex>
          {followerStatItems.map((item, index) => {
            let data = 0;
            if (item.title === "Reputation") data = follower.reputation;
            else if (item.title === "Followers") data = follower.numOfFollowers;
            else if (item.title === "Posts") data = follower.numOfPosts;
            return (
              <Tooltip title={item.title} placement="bottom">
                <Flex style={{ paddingRight: "14px" }}>
                  <Flex>
                    <div>{item.icon}</div>
                    <div style={{ marginLeft: "4px" }}>{data}</div>
                  </Flex>
                </Flex>
              </Tooltip>
            );
          })}
        </Flex>
        <Button
          style={{ marginTop: "8px" }}
          type="primary"
          icon={<UserAddOutlined />}
        >
          Follow
        </Button>
      </div>
    </Flex>
  );
};

const Followers: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<IFollower[] | undefined>();

  const fetchFollowers = useCallback(
    async (page: number) => {
      if (!id) return;
      const res = await fetchFollowersOfUserById(id, page, 5);
      setFollowers(res?.data.data?.result ?? []);
      return res?.data.data?.meta;
    },
    [id]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchFollowers(page);
  }, [location.search, fetchFollowers]);

  return (
    <div>
      {followers && followers?.length > 0 ? (
        <Row>
          <PaginationHandler fetchData={fetchFollowers}>
            <>
              {followers.map((follower: IFollower, index: number) => {
                return (
                  <Col
                    key={index}
                    xxl={8}
                    xl={8}
                    lg={8}
                    md={12}
                    sm={12}
                    xs={24}
                  >
                    <FollowerItem
                      follower={follower}
                      onClick={() => navigate(`/profile/${follower._id}`)}
                    />
                  </Col>
                );
              })}
            </>
          </PaginationHandler>
        </Row>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Followers;
