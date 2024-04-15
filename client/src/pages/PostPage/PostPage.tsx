import { useParams } from "react-router-dom";
import UserStateContext from "../../context/users/UserContext";
import { useContext, useEffect, useState } from "react";
import { Avatar, Pagination, Tag } from "antd";
import { IPost } from "../../types/backend";
import { fetchPostById } from "../../services/postsApi";
import styles from "./PostPage.module.scss";
import ReactQuill, { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

import { TOOLBAR_OPTIONS } from "./toolbarOption";
import UserAvatar from "../../components/shared/Avatar";
import { EditOutlined, StarOutlined, UserAddOutlined } from "@ant-design/icons";

Quill.register("modules/emoji", Emoji);

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [comment, setComment] = useState<string>("");
  const [post, setPost] = useState<IPost | undefined>();
  const { user } = useContext(UserStateContext);
  const [showSideAvatar, setShowSideAvatar] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Change 100 to the scroll position where you want the avatar to stick
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
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const res = await fetchPostById(id);
      if (res) {
        setPost(res.data.data);
      }
    };
    fetchPost();
  }, [id]);
  return (
    <>
      <div className={styles["avatar-wrapper"]}>
        {showSideAvatar && <Avatar src={user?.profileImageUrl} size={40} />}
      </div>
      <div className={styles["container"]}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              <Avatar src={user?.profileImageUrl} size={40} />
              <div style={{ marginLeft: "24px" }}>
                <a>{user?.username}</a>
                <div style={{ display: "flex", marginTop: "8px" }}>
                  <div style={{ paddingRight: "12px" }}>
                    <StarOutlined /> 42
                  </div>
                  <div style={{ paddingRight: "12px" }}>
                    <UserAddOutlined /> 1
                  </div>
                  <div style={{ paddingRight: "12px" }}>
                    <EditOutlined /> 2
                  </div>
                </div>
              </div>
            </div>
            <div>Đã đăng vào khoảng 22 giờ trước - 12 phút đọc</div>
          </div>
          <h1 className={styles["title"]}>{post?.title}</h1>
          <div
            style={{ maxWidth: "100%" }}
            className={styles["content"]}
            dangerouslySetInnerHTML={{
              __html: post?.content ? post.content : "",
            }}
          ></div>
          <div style={{ marginTop: "50px" }}>
            {post?.tags &&
              post?.tags.length > 0 &&
              post?.tags.map((tag) => (
                <Tag style={{ fontSize: "16px", padding: "8px" }}>
                  {tag.value}
                </Tag>
              ))}
            <div style={{ marginTop: "100px" }}>
              <h1>Comment</h1>
              <div style={{ display: "flex" }}>
                <div>
                  <UserAvatar
                    src={user?.profileImageUrl}
                    username={user?.username}
                    size={40}
                  />
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "95%",
                    // flex: 1,
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={comment}
                    onChange={setComment}
                    modules={{
                      toolbar: {
                        container: TOOLBAR_OPTIONS,
                      },
                      "emoji-toolbar": true,
                      "emoji-textarea": false,
                      "emoji-shortname": true,
                    }}
                    placeholder="Write something ..."
                    style={{ minHeight: "200px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
