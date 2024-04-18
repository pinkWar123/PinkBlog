import { Avatar, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { IPost } from "../../types/backend";
import { fetchPostById } from "../../services/postsApi";
import { EditOutlined, StarOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "./PostPage.module.scss";
import ShowTopPostsContext from "../../context/top-posts/ShowTopPostContext";

const Post: React.FC<{ post: IPost | undefined }> = ({ post }) => {
  const { showTopPosts, setShowTopPosts } = useContext(ShowTopPostsContext);
  const postContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (postContentRef.current) {
        const postContentRect = postContentRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollY === 0 || postContentRect.top > 0) {
          setShowTopPosts(true); // User scrolled to the top or above the post content
        } else if (postContentRect.bottom <= windowHeight) {
          setShowTopPosts(false); // User scrolled past the bottom of the post content
        } else {
          setShowTopPosts(true); // User scrolled back up past the bottom of the post content
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setShowTopPosts]);
  console.log(showTopPosts);
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
      <div ref={postContentRef}></div>
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
