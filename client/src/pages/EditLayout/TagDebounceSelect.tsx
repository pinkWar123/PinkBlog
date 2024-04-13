import { useRef, useState } from "react";
import DebounceSelect from "../../components/shared/DebounceSelect";
import { getTagsByRegex } from "../../services/tagsApi";

export type TagValue = {
  label: string;
  value: string;
};

interface IProps {
  tags: TagValue[];
  setTags: (value: TagValue[]) => void;
}

const TagDebounceSelect: React.FC<IProps> = ({ tags, setTags }: IProps) => {
  const fetchTagList = async (value: string): Promise<TagValue[]> => {
    if (value === "") return [];
    const res = await getTagsByRegex(value, 5);
    if (res && res.data.data && res.data.data.result.length > 0) {
      return res.data.data.result.map((tag) => ({
        label: tag.value,
        value: tag._id,
      }));
    }
    return [];
  };
  return (
    <DebounceSelect
      maxCount={5}
      id="tagInput"
      mode="multiple"
      value={tags}
      placeholder="Select users"
      fetchOptions={fetchTagList}
      onChange={(newValue) => {
        setTags(newValue as TagValue[]);
      }}
      // onSearch={handleInputChange} // Handle input change
      style={{ width: "100%" }}
    />
  );
};

export default TagDebounceSelect;
