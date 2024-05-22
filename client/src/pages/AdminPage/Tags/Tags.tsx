import { useState } from "react";
import { IBackendRes, ITag } from "../../../types/backend";
import TableHandler from "../../../components/admin/TableHandler";
import {
  createNewTag,
  deleteTagById,
  fetchTagsWithPagination,
  getTagById,
  getTagByValue,
  updateTagById,
} from "../../../services/tagsApi";
import { Button, ColorPicker, Flex, Form, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CreateTagDto, UpdateTagDto } from "../../../types/dtos";
import TagForm from "./TagForm";
import { AxiosResponse } from "axios";

const Tags: React.FC = () => {
  const [tags, setTags] = useState<ITag[] | undefined>();
  const [edit, setEdit] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addTags, setAddTags] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      key: "_id",
      editable: false,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      ellipsis: true,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      editable: true,
      render: (value: string) => (
        <ColorPicker value={value} disabled showText />
      ),
    },
    {
      title: "Create At",
      dataIndex: "createdAt",
      key: "createdAt",
      editable: true,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      editable: true,
    },
  ];

  const onFinish = async (res: AxiosResponse<IBackendRes<ITag>>) => {
    if (res && res.status === 201) {
      setTags((prev) => {
        if (!prev || !res.data.data) return prev;
        return [...prev, res.data.data];
      });
    }
  };
  const getInitialValues = () => {
    if (!tags || activeIndex === undefined || tags.length === 0)
      return undefined;
    return tags[activeIndex];
  };
  const handleUpdateData = async (res: AxiosResponse<IBackendRes<ITag>>) => {
    if (!tags || activeIndex === undefined || tags.length === 0)
      return undefined;
    if (res && res.status === 200) {
      const newTag = await getTagById(tags[activeIndex]._id);
      setTags((prev) => {
        if (!prev) return prev;
        return prev?.map((item, index) => {
          if (index !== activeIndex) return item;
          return newTag.data.data ?? item;
        });
      });
      return tags[activeIndex]._id;
    } else {
      return null;
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setAddTags(true)}
      >
        Add tags
      </Button>
      <TableHandler
        data={tags}
        setData={setTags}
        fetchData={fetchTagsWithPagination}
        setEdit={setEdit}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        columns={columns}
        deleteData={deleteTagById}
        style={{ marginTop: "12px" }}
      />
      {edit && (
        <TagForm
          type="edit"
          title="Edit tag"
          initialValues={getInitialValues()}
          onHide={() => setEdit(false)}
          onFinish={handleUpdateData}
        />
      )}

      {addTags && (
        <TagForm
          type="add"
          title="Create a new tag"
          onHide={() => setAddTags(false)}
          onFinish={onFinish}
        />
      )}
    </>
  );
};

export default Tags;
