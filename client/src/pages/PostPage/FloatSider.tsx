import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import styles from "./PostPage.module.scss";
import { Avatar, Tooltip, message } from "antd";
import { IPost, IUser } from "../../types/backend";
import { useContext, useEffect, useState } from "react";
import UserStateContext from "../../context/users/UserContext";
import { downvote, upvote } from "../../services/postsApi";

const FloatSider: React.FC<{ post: IPost | undefined }> = ({ post }) => {
  const [showSideAvatar, setShowSideAvatar] = useState<boolean>(false);
  const { user } = useContext(UserStateContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [likes, setLikes] = useState<number>(0);
  useEffect(() => {
    setLikes(post?.likes ?? 0);
  }, [post?.likes]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowSideAvatar(true);
      } else {
        setShowSideAvatar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInvalidVote = (
    user: IUser | undefined,
    post: IPost | undefined
  ) => {
    if (!post || !post._id) {
      messageApi.open({
        type: "error",
        content: "Invalid post",
      });
      return;
    }
    if (!user)
      messageApi.open({
        type: "error",
        content: "Please log in to upvote/downvote",
      });
  };

  const handleVote = async (action: "upvote" | "downvote") => {
    handleInvalidVote(user, post);
    if (post?._id) {
      let res;
      if (action === "upvote") res = await upvote(post?._id);
      else if (action === "downvote") res = await downvote(post?._id);
      if (res && res.status === 201) {
        setLikes(res.data.data?.likes ?? 0);
      }
    }
  };

  return (
    <div className={styles["avatar-wrapper"]}>
      {contextHolder}
      {showSideAvatar && (
        <div>
          <div>
            <Avatar src={post?.createdBy?.profileImageUrl} size={40} />
          </div>
          <Tooltip color="geekblue" title="Upvote" placement="right">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "12px",
              }}
              onClick={() => handleVote("upvote")}
            >
              <CaretUpOutlined style={{ fontSize: "30px" }} />
            </div>
          </Tooltip>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {likes < 0 ? `${likes}` : `+${likes}`}
          </div>
          <Tooltip color="geekblue" title="Downvote" placement="right">
            <div
              style={{ display: "flex", justifyContent: "center" }}
              onClick={() => handleVote("downvote")}
            >
              <CaretDownOutlined style={{ fontSize: "30px" }} />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default FloatSider;
