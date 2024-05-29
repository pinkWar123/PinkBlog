import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IPost } from "../../types/backend";
import { fetchPostsByAuthorId, removePostById } from "../../services/postsApi";
import PaginationHandler from "../../components/shared/PaginationHandler";
import { Empty, Modal, Tooltip, message } from "antd";
import { PostItem } from "../../components/shared";
import UserStateContext from "../../context/users/UserContext";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { handleErrorMessage } from "../../utils/handleErrorMessage";

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(UserStateContext);
  const [posts, setPosts] = useState<IPost[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const fetchPosts = useCallback(
    async (page: number) => {
      if (!id) return;
      const res = await fetchPostsByAuthorId(id, page, 5);
      setPosts(res?.data.data?.result ?? []);
      return res?.data.data?.meta;
    },
    [id]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;

    fetchPosts(page);
  }, [location.search, fetchPosts]);

  return (
    <div>
      {contextHolder}
      {posts && posts?.length > 0 ? (
        <PaginationHandler fetchData={fetchPosts}>
          <div>
            {posts.map((post: IPost, index: number) => {
              return (
                <PostItem
                  tags={post.tags}
                  createdAt={post.createdAt}
                  createdBy={post.createdBy}
                  title={post.title}
                  key={index}
                  onClick={(e) => navigate(`/posts/${post._id}`)}
                  actions={
                    user?._id === id
                      ? [
                          <Tooltip title="Edit">
                            <EditOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts/${post._id}/update`);
                              }}
                            />
                          </Tooltip>,
                          <Tooltip title="Delete">
                            <DeleteOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                Modal.warning({
                                  title: "Deleting post",
                                  content:
                                    "Do you want to delete this post? This action cannot be undone?",
                                  async onOk(...args) {
                                    const res = await removePostById(post._id);
                                    if (res && res.status === 200) {
                                      message.success({
                                        content: "Delete post successfully",
                                      });
                                      setPosts((prev) => {
                                        if (!prev) return prev;
                                        return prev?.filter((post, _index) => {
                                          return _index !== index;
                                        });
                                      });
                                    } else handleErrorMessage(res, message);
                                  },
                                });
                              }}
                            />
                          </Tooltip>,
                        ]
                      : []
                  }
                />
              );
            })}
          </div>
        </PaginationHandler>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Posts;
