import ReactQuill from "react-quill";
import { TOOLBAR_OPTIONS } from "./toolbarOption";
import { Button, Result } from "antd";
import { useContext, useState } from "react";
import UserStateContext from "../../context/users/UserContext";
import UserAvatar from "../../components/shared/Avatar";
import { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
import { createRootComment } from "../../services/commentsApi";
import CommentList from "./CommentList";

Quill.register("modules/emoji", Emoji);

const Comment: React.FC<{ targetId: string | undefined }> = ({ targetId }) => {
  const { user } = useContext(UserStateContext);
  const [comment, setComment] = useState<string>("");
  const postRootComment = async () => {
    if (!targetId) return;
    const res = await createRootComment(comment, targetId);
    console.log(res);
  };
  return (
    <>
      <h1>Comment</h1>
      <div>
        {user ? (
          <div style={{ border: "1px solid #ddd", padding: "20px 24px" }}>
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
                  flexWrap: "wrap",
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
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ marginTop: "12px", justifyContent: "flex-end" }}
                disabled={
                  comment.replace(/<(.|\n)*?>/g, "").trim().length === 0
                }
                onClick={postRootComment}
              >
                Comment
              </Button>
            </div>
          </div>
        ) : (
          <Result
            title="Please log in to write comments!"
            extra={<Button>Log in / Sign Up</Button>}
          />
        )}
        <CommentList targetId={targetId} />
        <div style={{ marginTop: "24px", cursor: "pointer", color: "purple" }}>
          See more comments...
        </div>
      </div>
    </>
  );
};
export default Comment;
