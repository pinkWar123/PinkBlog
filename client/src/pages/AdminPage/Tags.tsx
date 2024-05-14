import { useState } from "react";
import { ITag } from "../../types/backend";
import TableHandler from "../../components/admin/TableHandler";
import {
  createNewTag,
  deleteTagById,
  fetchTagsWithPagination,
  getTagByValue,
  updateTagById,
} from "../../services/tagsApi";
import { Button, Flex, Form, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CreateTagDto, UpdateTagDto } from "../../types/dtos";

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
      title: "Create At",
      dataIndex: "createdAt",
      key: "createdAt",
      editable: true,
    },
  ];

  const onFinish = async (value: CreateTagDto) => {
    const res = await createNewTag(value);
    console.log(res);
    if (res && res.status === 201) {
      setTags((prev) => {
        if (!prev || !res.data.data) return prev;
        return [...prev, res.data.data];
      });
      message.open({
        type: "success",
        content: "Add tag succesfully",
        duration: 1,
      });
    } else {
      message.open({
        type: "error",
        content: "Add tag failed",
        duration: 1,
      });
    }
    setAddTags(false);
  };
  const getInitialValues = () => {
    if (!tags || !activeIndex || tags.length === 0) return undefined;
    return tags[activeIndex];
  };
  const handleUpdateData = async (value: UpdateTagDto) => {
    if (!tags || !activeIndex || tags.length === 0) return undefined;
    const res = await updateTagById(tags[activeIndex]._id, value);
    if (res && res.status === 200) {
      setTags((prev) => {
        if (!prev) return prev;
        return prev?.map((item, index) => {
          if (index !== activeIndex) return item;
          return {
            ...item,
            value: value.value,
          };
        });
      });
      message.open({
        type: "success",
        content: "Update tags successfully",
        duration: 1,
      });
    } else {
      message.open({
        type: "error",
        content: "Update tags failed",
        duration: 1,
      });
    }
    setEdit(false);
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
        <Modal title="Edit tag" open footer={<></>}>
          <Form initialValues={getInitialValues()} onFinish={handleUpdateData}>
            <Form.Item name="_id" label="_id">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="value"
              label="Value"
              validateDebounce={500}
              rules={[
                {
                  type: "string",
                  min: 1,
                  max: 50,
                },
                {
                  validator: async (_, value: string) => {
                    const hasTagExisted = await getTagByValue(value);
                    if (
                      hasTagExisted &&
                      hasTagExisted.data.data &&
                      hasTagExisted?.data.data?.meta?.total > 0
                    )
                      throw new Error(`Tag ${value} has already existed`);
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Flex justify="flex-end" gap="small">
              <Form.Item>
                <Button type="dashed" onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Modal>
      )}
      {addTags && (
        <Modal open title="Add a new tag">
          <Form onFinish={onFinish}>
            <Form.Item
              label="Value"
              name="value"
              rules={[
                {
                  required: true,

                  message: "Value must not be empty",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value.length < 3)
                      return Promise.reject(
                        "Value must be at least 3 characters"
                      );
                    if (value.length > 50)
                      return Promise.reject(
                        "Value must be at least 50 characters"
                      );
                    return Promise.resolve();
                  },
                }),
                // {
                //   validator: (_, value: string) => {
                //     if (value.length < 1)
                //       throw new Error("Value must be longer than 1 character");
                //     if (value.length > 50)
                //       throw new Error(
                //         "Value must be shorter than 50 characters"
                //       );
                //   },
                // },
              ]}
            >
              <Input />
            </Form.Item>

            {/* <Flex justify="flex-end" gap="small"> */}
            {/* <Form.Item>
                <Button type="dashed" onClick={() => setAddTags(false)}>
                  Cancel
                </Button>
              </Form.Item> */}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Tags;
