import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IPost } from "../../types/backend";
import { fetchPostsByAuthorId } from "../../services/postsApi";
import PaginationHandler from "../../components/shared/PaginationHandler";
import { Empty } from "antd";
import { PostItem } from "../../components/shared";

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [posts, setPosts] = useState<IPost[]>();

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
    console.log(page);
    fetchPosts(page);
  }, [location.search, fetchPosts]);

  return (
    <div>
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
