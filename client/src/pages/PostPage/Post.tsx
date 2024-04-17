import { Avatar, Tag } from "antd";
import { useEffect, useState } from "react";
import { IPost } from "../../types/backend";
import { fetchPostById } from "../../services/postsApi";
import { EditOutlined, StarOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "./PostPage.module.scss";

const Post: React.FC<{ id: string | undefined }> = ({ id }) => {
  const [post, setPost] = useState<IPost | undefined>();
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Avatar src={post?.createdBy?.profileImageUrl} size={40} />
          <div style={{ marginLeft: "24px" }}>
            <a>{post?.createdBy?.username}</a>
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
            <Tag style={{ fontSize: "16px", padding: "8px" }}>{tag.value}</Tag>
          ))}
      </div>
    </>
  );
};

export default Post;
