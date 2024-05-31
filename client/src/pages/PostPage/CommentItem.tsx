import { useContext, useEffect, useState } from "react";
import { IComment, IUser } from "../../types/backend";
import styles from "./PostPage.module.scss";
import { getFormatDate } from "../../utils/formateDate";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Avatar, Tag, message } from "antd";
import CommentEdit from "./CommentEdit";
import classNames from "classnames/bind";
import UserAvatar from "../../components/shared/Avatar";
import {
  downvote,
  fetchListOfCommentsByIds,
  upvote,
} from "../../services/commentsApi";
import CommentStateContext from "../../context/comment/CommentContext";
import UserStateContext from "../../context/users/UserContext";
const cx = classNames.bind(styles);

const commentPageSize = 5;

const CommentItem: React.FC<{ comment: IComment }> = ({ comment }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(UserStateContext);
  const [showReplyEdit, setShowReplyEdit] = useState<boolean>(false);
  const { commentList, setCommentList } = useContext(CommentStateContext);
  const [startCommentIndex, setStartCommentIndex] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  useEffect(() => {
    setLikes(comment.likes ?? 0);
  }, [comment.likes]);
  useEffect(() => {
    if (comment.parentId) {
      comment.content = `
        <span>
        ${comment.content}
        </span>`;
    }
  }, [comment]);

  const fetchMoreReplies = async (
    startCommentIndex: number,
    pageSize: number
  ) => {
    const _pageSize = Math.min(
      pageSize,
      comment.childrenIds.length - startCommentIndex
    );
    console.log(comment.childrenIds);
    const res = await fetchListOfCommentsByIds(
      comment.childrenIds.slice(
        startCommentIndex,
        startCommentIndex + _pageSize
      ) as string[]
      // .map((child) => child._id)
    );
    console.log("reply comments:", res?.data.data);
    if (res?.status === 201 && res.data.data) {
      setCommentList((prev) => {
        if (prev?.length === 0 || res.data.data === undefined) return prev;
        return (
          prev?.map((_comment) => {
            if (comment?._id === _comment?._id) {
              if (res.data.data) {
                if (_comment.children?.length > 0)
                  _comment.children = [..._comment.children, ...res.data.data];
                else _comment.children = res.data.data;
              }
            }
            return _comment;
          }) ?? prev
        );
      });
      setStartCommentIndex((prev) => prev + _pageSize);
    }
  };
  console.log("comment list: ", commentList);
  const renderReplyComments = () => {
    const numOfComments = comment.childrenIds?.length ?? 0;
    if (comment.parentId || numOfComments === 0) return;
    if (comment.children?.length > 0 && !comment.children[0]?.content) {
      return (
        <div
          onClick={() => fetchMoreReplies(startCommentIndex, commentPageSize)}
        >
          {comment.childrenIds.length} replies
        </div>
      );
    } else {
      const numOfCommentsLeft = comment.childrenIds.length - startCommentIndex;
      return (
        <>
          {comment.children?.length > 0 &&
            comment.children.map((childComment) => {
              return (
                childComment?.content && (
                  <div className={cx("reply-comment")}>
                    <CommentItem comment={childComment} />
                  </div>
                )
              );
            })}
          {numOfCommentsLeft > 0 && (
            <div
              onClick={() =>
                fetchMoreReplies(startCommentIndex, commentPageSize)
              }
              style={{
                marginTop: "12px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <>
                {comment.children ? (
                  <>See {numOfCommentsLeft} more replies</>
                ) : (
                  <>This post has {numOfComments} replies...</>
                )}
              </>
            </div>
          )}
        </>
      );
    }
  };

  const handleInvalidVote = (
    user: IUser | undefined,
    comment: IComment | undefined
  ) => {
    if (!comment || !comment._id) {
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
    handleInvalidVote(user, comment);
    if (comment?._id) {
      let res;
      if (action === "upvote") res = await upvote(comment?._id);
      else if (action === "downvote") res = await downvote(comment?._id);
      if (res && res.status === 201) {
        setLikes(res.data.data?.likes ?? 0);
      }
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={
          !comment.parentId
            ? { border: "1px solid #ddd", padding: "20px 24px" }
            : {}
        }
      >
        <div style={{ display: "flex" }}>
          <Avatar src={comment.createdBy?.profileImageUrl} size={40} />
          <div style={{ marginLeft: "12px" }}>
            <a
              href={`/profile/${comment?.createdBy?._id}`}
              style={{ paddingBottom: "12px" }}
            >
              {comment?.createdBy?.username}
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
            marginTop: "6px",
            width: "95%",
            flexWrap: "wrap",
          }}
        >
          {comment.parentId && (
            <span>
              Đã trả lời <Tag>@{comment.parentId?.createdBy?.username}</Tag>
            </span>
          )}
          <div
            style={{ maxWidth: "100%", fontSize: "18px" }}
            className={styles["content"]}
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          ></div>
        </div>
        <div style={{ display: "flex", lineHeight: "12px" }}>
          <UpOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleVote("upvote")}
          />
          <span style={{ padding: "0px 4px" }}>
            {likes < 0 ? likes : `+${likes}`}
          </span>
          <DownOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleVote("downvote")}
          />
          <div style={{ marginLeft: "6px", paddingRight: "6px" }}>|</div>
          <div
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setShowReplyEdit(true)}
          >
            Trả lời
          </div>
        </div>
        {showReplyEdit && (
          <div style={{ width: "100%" }}>
            <CommentEdit
              onCancel={() => setShowReplyEdit(false)}
              parentId={comment._id}
              onUpdateStartCommentIndex={setStartCommentIndex}
            />
          </div>
        )}
        {!comment.parentId &&
          comment.childrenIds?.length > 0 &&
          renderReplyComments()}
      </div>
    </div>
  );
};

export default CommentItem;
