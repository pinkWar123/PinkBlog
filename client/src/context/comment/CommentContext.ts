import { createContext } from "react";
import { IComment, IMeta } from "../../types/backend";

interface CommentContextType {
  commentList: IComment[] | undefined;
  setCommentList: React.Dispatch<React.SetStateAction<IComment[] | undefined>>;
  postRootComment: (content: string) => Promise<boolean>;
  postReplyComment: (parentId: string, content: string) => Promise<boolean>;
  meta: IMeta;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  fetchCommentList: () => Promise<void>;
}

const CommentStateContext = createContext<CommentContextType>({
  commentList: undefined,
  setCommentList: () => {},
  postRootComment: async (content: string) => true,
  postReplyComment: async (parentId: string, content: string) => true,
  meta: {
    total: 0,
    current: 0,
    pageSize: 1,
    pages: 0,
  },
  setMeta: () => {},
  fetchCommentList: async () => {},
});

export default CommentStateContext;
