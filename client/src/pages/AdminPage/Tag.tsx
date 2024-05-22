import { useState } from "react";
import { ITag } from "../../types/backend";
import { TableParams } from "./type";

const Tag: React.FC = () => {
  const [tags, setTags] = useState<ITag[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  return <></>;
};

export default Tag;
