import { useCallback, useEffect, useState } from "react";
import { IPost } from "../../types/backend";
import { fetchLatestPosts } from "../../services/postsApi";
import { Pagination, PaginationProps, Skeleton } from "antd";
import { PostItem } from "../../components/shared";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {
  type: "following" | "content-creator" | "latest" | "series";
}

const Content: React.FC<IProps> = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<IPost[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const fetchPosts = useCallback(
    async (page: number) => {
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
        setTotal(res.data.data?.meta.total ?? 0);
        setPageSize(res.data.data?.meta.pageSize ?? 0);
        setCurrent(page);
        setLoading(false);
      }
    },
    [type, setPosts, setTotal, setPageSize, setLoading]
  );

  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchPosts(page);
  }, [type, location.search, fetchPosts]);

  const onChange: PaginationProps["onChange"] = (pageNumber) => {
    console.log("Page: ", pageNumber);
    navigate(`/${type}?page=${pageNumber}`);
    // window.location.href = `localhost:3000/${type}?page=${pageNumber}`;
    fetchPosts(pageNumber);
  };

  return (
    <Skeleton loading={loading}>
      <div>
        {posts &&
          posts.length > 0 &&
          posts.map((post: IPost, index: number) => {
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "85%",
            marginTop: "30px",
          }}
        >
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
            style={{ marginTop: "50px", paddingBottom: "50px" }}
          />
        </div>
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
