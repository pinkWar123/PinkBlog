import { useParams } from "react-router-dom";
import UserStateContext from "../../context/users/UserContext";
import { useContext, useEffect, useState } from "react";
import { Avatar } from "antd";
import styles from "./PostPage.module.scss";

import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

import Comment from "./Comment";
import Post from "./Post";

const PostPage: React.FC = () => {
  const { id } = useParams();

  const { user } = useContext(UserStateContext);
  const [showSideAvatar, setShowSideAvatar] = useState<boolean>(false);
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

  return (
    <div style={{ paddingBottom: "64px" }}>
      <div className={styles["avatar-wrapper"]}>
        {showSideAvatar && <Avatar src={user?.profileImageUrl} size={40} />}
      </div>
      <div className={styles["container"]}>
        <div>
          <Post id={id} />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <Comment targetId={id} />
      </div>
    </div>
  );
};

export default PostPage;
