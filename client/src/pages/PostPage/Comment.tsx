import { useContext } from "react";
import { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
import CommentItem from "./CommentItem";
import CommentEdit from "./CommentEdit";
import CommentStateContext from "../../context/comment/CommentContext";

Quill.register("modules/emoji", Emoji);

const Comment: React.FC<{ targetId: string | undefined }> = ({ targetId }) => {
  const { commentList, meta, fetchCommentList } =
    useContext(CommentStateContext);
  return (
    <>
      <h1>Comment</h1>
      <div>
        <div style={{ width: "100%" }}>
          <CommentEdit />
        </div>
        {commentList &&
          commentList.length > 0 &&
          commentList.map((comment) => <CommentItem comment={comment} />)}
        {meta.current < meta.pages && (
          <div
            onClick={() => fetchCommentList()}
            style={{ marginTop: "24px", cursor: "pointer", color: "purple" }}
          >
            See more comments...
          </div>
        )}
      </div>
    </>
  );
};
export default Comment;
