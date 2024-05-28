import { useCallback, useContext, useEffect, useState } from "react";
import { IFollower, IUser } from "../../types/backend";
import PaginationHandler from "../../components/shared/PaginationHandler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchFollowersOfUserById,
  getUserById,
  handleFollowUserById,
} from "../../services/usersApi";
import { Avatar, Button, Col, Empty, Flex, Row, Tooltip } from "antd";
import {
  EditFilled,
  StarFilled,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import styles from "./ProfilePage.module.scss";
import UserStateContext from "../../context/users/UserContext";
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
const FollowerItem: React.FC<{
  follower: IFollower;
  onClick: () => void;
  user: IUser | undefined;
  refetchUser: () => Promise<void>;
}> = ({ follower, onClick, user, refetchUser }) => {
  const [isFollowed, setFollow] = useState<boolean>(user?.isFollowed ?? false);
  useEffect(() => {
    if (follower?.isFollowed) setFollow(follower.isFollowed);
  }, [follower]);
  return (
    <Flex style={{ padding: "20px 0" }}>
      <div>
        <Avatar
          size={48}
          src={follower.profileImageUrl}
          style={{ cursor: "pointer" }}
          onClick={onClick}
        />
      </div>
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
          icon={isFollowed ? <UserDeleteOutlined /> : <UserAddOutlined />}
          disabled={user === undefined || follower._id === user?._id}
          onClick={async () => {
            if (user?._id) {
              const res = await handleFollowUserById(follower._id, user._id);
              if (res?.status === 201) {
                await refetchUser();
                setFollow((prev) => !prev);
              }
            }
          }}
        >
          {isFollowed ? "Hủy theo dõi" : "Theo dõi"}
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
  const { user } = useContext(UserStateContext);

  const fetchFollowers = useCallback(
    async (page: number) => {
      if (!id) return;
      const res = await fetchFollowersOfUserById(id, page, 5, user?._id);
      setFollowers((prev) => {
        if (res?.data?.data?.result) return [...res?.data.data?.result];
        else return [];
      });
      return res?.data.data?.meta;
    },
    [id, user]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchFollowers(page);
  }, [location.search, fetchFollowers, user]);

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
                      user={user}
                      key={follower._id}
                      refetchUser={async () => {
                        const res = await getUserById(follower._id, user?._id);
                        if (res?.status === 200) {
                          setFollowers((prev) => {
                            if (!prev) return prev;
                            return prev.map((follower, _index) =>
                              _index === index
                                ? (res.data.data as IFollower)
                                : follower
                            );
                          });
                        }
                      }}
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
