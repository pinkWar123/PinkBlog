import { useContext } from "react";
import DebounceSelect from "../../components/shared/DebounceSelect";
import { fetchPosts } from "../../services/postsApi";
import UserStateContext from "../../context/users/UserContext";
import { Typography } from "antd";

export type PostValue = {
  label: JSX.Element;
  value: string;
};

interface IProps {
  posts: PostValue[];
  setPosts: (value: PostValue[]) => void;
  currentPosts?: string[];
}

const SeriesDebounceSelect: React.FC<IProps> = ({
  posts,
  setPosts,
  currentPosts,
}: IProps) => {
  const { user } = useContext(UserStateContext);

  const fetchUserPostsList = async (value: string) => {
    let res;
    let queryString = `current=1&pageSize=5&createdBy=${user?._id}`;
    if (currentPosts && currentPosts.length > 0) {
      queryString += "&_id!=";
      currentPosts.forEach((currentPost) => (queryString += `${currentPost},`));
      queryString = queryString.slice(0, -1);
    }
    if (value === "") {
      res = await fetchPosts(queryString);
    } else {
      res = await fetchPosts(queryString + `&title=/^${value}/`);
    }
    if (res?.data?.data)
      return res.data.data.result.map((tag) => ({
        label: (
          <Typography.Paragraph ellipsis={{ tooltip: true, rows: 1 }}>
            {tag.title}
          </Typography.Paragraph>
        ),
        value: tag._id,
      }));
    return [];
  };

  return (
    <DebounceSelect
      maxCount={5}
      id="tagInput"
      mode="multiple"
      value={posts}
      placeholder="Select your posts..."
      fetchOptions={fetchUserPostsList}
      onChange={(newValue) => {
        setPosts(newValue as PostValue[]);
      }}
      style={{ width: "100%" }}
    />
  );
};

export default SeriesDebounceSelect;
