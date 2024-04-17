import { useEffect, useState } from "react";
import { IComment } from "../../types/backend";
import { fetchCommentsOfPost } from "../../services/commentsApi";
import UserAvatar from "../../components/shared/Avatar";
import styles from "./PostPage.module.scss";
import { getFormatDate } from "../../utils/formateDate";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
const CommentList: React.FC<{ targetId: string | undefined }> = ({
  targetId,
}) => {
  const [commentList, setCommentList] = useState<IComment[] | undefined>([]);
  useEffect(() => {
    const fetchCommentList = async () => {
      if (!targetId) return;
      const res = await fetchCommentsOfPost(targetId, 0, 5);
      if (res?.status === 200) {
        setCommentList(res.data.data?.result);
      }
    };
    fetchCommentList();
  }, [targetId]);
  console.log(commentList);
  return (
    <div style={{ marginTop: "20px" }}>
      {commentList &&
        commentList.length > 0 &&
        commentList.map((comment) => (
          <div style={{ border: "1px solid #ddd", padding: "20px 24px" }}>
            <div style={{ display: "flex" }}>
              <UserAvatar
                src={comment.createdBy?.profileImageUrl}
                username={comment.createdBy?.username}
                size={40}
              />
              <div style={{ marginLeft: "12px" }}>
                <a href="#" style={{ paddingBottom: "12px" }}>
                  {comment.createdBy.username}
                </a>
                <div
                  style={{
                    marginTop: "8px",
                    fontWeight: "400",
                    color: "#9b9b9b",
                  }}
                >
                  {getFormatDate(comment.createdAt)}
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "12px",
                width: "95%",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ maxWidth: "100%", fontSize: "18px" }}
                className={styles["content"]}
                dangerouslySetInnerHTML={{
                  __html: comment.content,
                }}
              ></div>
            </div>
            <div style={{ display: "flex", lineHeight: "12px" }}>
              <UpOutlined />
              <span style={{ padding: "0px 4px" }}>+1</span>
              <DownOutlined />
              <div style={{ marginLeft: "6px", paddingRight: "6px" }}>|</div>
              <div style={{ color: "blue", cursor: "pointer" }}>Trả lời</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommentList;
