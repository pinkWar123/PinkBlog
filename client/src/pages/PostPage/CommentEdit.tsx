import { useContext, useState } from "react";
import UserStateContext from "../../context/users/UserContext";
import UserAvatar from "../../components/shared/Avatar";
import ReactQuill from "react-quill";
import { Avatar, Button, Result, Space } from "antd";
import { TOOLBAR_OPTIONS } from "./toolbarOption";
import CommentStateContext from "../../context/comment/CommentContext";
import styles from "./PostPage.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface ICommentEditProps {
  parentId?: string;
  onCancel?: () => void;
  onUpdateStartCommentIndex?: React.Dispatch<React.SetStateAction<number>>;
}

const CommentEdit: React.FC<ICommentEditProps> = ({
  parentId,
  onCancel,
  onUpdateStartCommentIndex,
}) => {
  const { user } = useContext(UserStateContext);
  const [comment, setComment] = useState<string>("");
  const [isPostingComment, setPostingComment] = useState<boolean>(false);
  const { postRootComment, postReplyComment } = useContext(CommentStateContext);
  const handlePostComment = async () => {
    setPostingComment(true);
    if (!parentId) postRootComment(comment);
    else postReplyComment(parentId, comment);
    setComment("");
    setPostingComment(false);
    if (parentId && onCancel) onCancel();
    if (parentId) {
      if (onCancel) onCancel();
      if (onUpdateStartCommentIndex)
        onUpdateStartCommentIndex((prev) => prev + 1);
    }
  };
  return (
    <>
      {user ? (
        <div>
          <div
            className={cx("comment-wrapper", {
              reply: parentId !== undefined,
            })}
          >
            <div style={{ display: "flex" }}>
              <div>
                <Avatar src={user?.profileImageUrl} size={40} />
              </div>
              <div
                style={{
                  marginLeft: "12px",
                  width: "95%",
                  flexWrap: "wrap",
                }}
              >
                <ReactQuill
                  readOnly={isPostingComment}
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
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "12px",
              }}
            >
              <Space>
                {onCancel && <Button onClick={onCancel}>Cancel</Button>}
                <Button
                  style={{ justifyContent: "flex-end" }}
                  disabled={
                    comment.replace(/<(.|\n)*?>/g, "").trim().length === 0 ||
                    isPostingComment
                  }
                  onClick={handlePostComment}
                  loading={isPostingComment}
                >
                  Comment
                </Button>
              </Space>
            </div>
          </div>
        </div>
      ) : (
        <Result
          title="Please log in to write comments!"
          extra={<Button>Log in / Sign Up</Button>}
        />
      )}
    </>
  );
};
export default CommentEdit;
