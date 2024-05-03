import { ReactNode, useCallback, useEffect, useState } from "react";
import CommentStateContext from "./CommentContext";
import { IComment, IMeta } from "../../types/backend";
import {
  createComment,
  fetchCommentsOfPost,
  fetchListOfCommentsByIds,
} from "../../services/commentsApi";

const pageSize = 1;

const CommentStateProvider: React.FC<{
  children: ReactNode | null;
  targetId: string | undefined;
}> = ({ children, targetId }) => {
  const [commentList, setCommentList] = useState<IComment[] | undefined>([]);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    current: 0,
    pageSize: pageSize,
    pages: 0,
  });

  const fetchCommentList = async () => {
    if (!targetId) return;
    const res = await fetchCommentsOfPost(
      targetId,
      meta.current,
      meta.pageSize
    );
    if (res?.status === 200) {
      setCommentList((prev) => {
        // Extract the new comments from the response data
        const newComments = res.data.data?.result ?? [];
        console.log("new comments: ", newComments);
        // If previous array is empty or undefined, return the new comments directly
        if (!prev || prev.length === 0) {
          return newComments;
        }

        // Filter out any new comments that already exist in the previous array
        const uniqueNewComments = newComments.filter(
          (newComment) =>
            !prev.some((prevComment) => prevComment._id === newComment._id)
        );

        // Append the filtered new comments to the end of the previous array
        return [...prev, ...uniqueNewComments];
      });
      // setCommentList((prev) => {
      //   if (prev && prev.length > 0) {
      //     if (res.data.data?.result) return [...prev, ...res.data.data?.result];
      //     return prev;
      //   } else return res.data.data?.result ?? [];
      // });
      const _meta = res.data.data?.meta;
      if (_meta) {
        setMeta((prev) => ({
          pageSize: _meta.pageSize,
          current: prev.current + 1,
          total: _meta.total,
          pages: _meta.pages,
        }));
      }
    }
  };

  useEffect(() => {
    fetchCommentList();
  }, []);

  const postRootComment = async (comment: string) => {
    if (!targetId) return false;
    const res = await createComment(comment, targetId);
    if (res && res.status === 201) {
      setCommentList((prev) => {
        const newComment = res.data.data;
        if (!newComment) return prev;
        if (prev) {
          return [newComment, ...prev];
        } else {
          return [newComment];
        }
      });
    } else return false;
    return true;
  };
  const postReplyComment = async (parentId: string, content: string) => {
    if (!targetId) return false;
    const res = await createComment(content, targetId, parentId);
    if (res && res.status === 201) {
      setCommentList((prev) => {
        const newComment = res.data.data;
        if (!newComment) return prev;

        if (prev) {
          let hasNewCommentAdded: boolean = false;
          return prev.map((rootComment) => {
            if (hasNewCommentAdded) return rootComment;
            if (rootComment._id === parentId) {
              rootComment.childrenIds = [
                newComment._id,
                ...rootComment.childrenIds,
              ];
              rootComment.children = [newComment, ...rootComment.children];
              hasNewCommentAdded = true;
              return rootComment;
            }
            if (rootComment.childrenIds.length === 0) return rootComment;
            const isIncludeParentComment = rootComment.childrenIds.some(
              (item) => item === parentId
            );
            if (isIncludeParentComment) {
              rootComment.childrenIds = [
                newComment._id,
                ...rootComment.childrenIds,
              ];
              rootComment.children = [newComment, ...rootComment.children];
            }
            return rootComment;
          });
        } else {
          return [newComment];
        }
      });
    } else return false;
    return true;
  };
  return (
    <CommentStateContext.Provider
      value={{
        commentList,
        setCommentList,
        postRootComment,
        postReplyComment,
        meta,
        setMeta,
        fetchCommentList,
      }}
    >
      {children}
    </CommentStateContext.Provider>
  );
};

export default CommentStateProvider;
