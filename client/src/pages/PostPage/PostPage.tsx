import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FloatButton } from "antd";
import styles from "./PostPage.module.scss";

import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

import Comment from "./Comment";
import Post from "./Post";
import { IPost } from "../../types/backend";
import { fetchPostById } from "../../services/postsApi";
import CommentStateProvider from "../../context/comment/CommentContextProvider";
import FloatSider from "./FloatSider";

const PostPage: React.FC = () => {
  const { id } = useParams();
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
    <div style={{ paddingBottom: "64px" }}>
      <FloatSider post={post} />
      <div className={styles["container"]}>
        <div>
          <Post post={post} />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <CommentStateProvider targetId={id}>
          <Comment targetId={id} />
        </CommentStateProvider>
      </div>
      <FloatButton.BackTop tooltip="Scroll to top" />
    </div>
  );
};

export default PostPage;
