import { useCallback, useEffect, useState } from "react";
import { IPost } from "../../types/backend";
import { fetchLatestPosts } from "../../services/postsApi";
import { Skeleton } from "antd";
import { PostItem } from "../../components/shared";
import { useLocation, useNavigate } from "react-router-dom";
import PaginationHandler from "../../components/shared/PaginationHandler";

interface IProps {
  type: "following" | "content-creator" | "latest" | "series";
}

const Content: React.FC<IProps> = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<IPost[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchPosts = useCallback(
    async (page: number) => {
      setLoading(true);
      let res;
      switch (type) {
        case "following":
          res = null; // todo
          break;
        case "series":
          res = null; // todo
          break;
        case "content-creator":
          res = null; // todo
          break;
        case "latest":
          res = await fetchLatestPosts(page, 5);
      }
      if (res === null) {
        setLoading(false);
        return;
      }
      if (res?.status === 200) {
        console.log(res);
        setPosts(res.data.data?.result);
      }
      setLoading(false);
      return res?.data.data?.meta;
    },
    [type, setPosts, setLoading]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchPosts(page);
  }, [type, location.search, fetchPosts]);

  return (
    <Skeleton loading={loading}>
      <div>
        {posts && posts.length > 0 && (
          <PaginationHandler fetchData={fetchPosts} module={type}>
            <>
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
            </>
          </PaginationHandler>
        )}
      </div>
    </Skeleton>
  );
};

export const Latest: React.FC = () => {
  return <Content type="latest" />;
};

export const Following: React.FC = () => {
  return <Content type="following" />;
};

export const ContentCreator: React.FC = () => {
  return <Content type="content-creator" />;
};

export const Series: React.FC = () => {
  return <Content type="series" />;
};

export default Content;
