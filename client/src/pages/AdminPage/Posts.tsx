import { useCallback, useMemo, useState } from "react";
import { IPost, IUser } from "../../types/backend";
import TableHandler from "../../components/admin/TableHandler";
import {
  fetchPosts,
  fetchPublicPosts,
  updatePostById,
} from "../../services/postsApi";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from "antd";
import { getFormatDate } from "../../utils/formateDate";
import QueryBuilder from "../../components/admin/QueryBuilder";

const getStatusType = (value: string) => {
  switch (value) {
    case "PENDING":
      return "secondary";
    case "REJECTED":
      return "danger";
    case "APPROVED":
      return "success";
  }
};

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<IPost[] | undefined>();
  const [activeIndex, setActiveIndex] = useState<number>();
  const [edit, setEdit] = useState<boolean>(false);
  const [queryBuilder, setQueryBuilder] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const columns = useMemo(
    () => [
      {
        title: "_id",
        dataIndex: "_id",
        key: "_id",
        editable: false,
        render: (_id: string) => (
          <Typography.Link
            href={`http://localhost:3000/posts/${_id}`}
            target="_blank"
          >
            {_id}
          </Typography.Link>
        ),
      },
      {
        title: "Author",
        dataIndex: "createdBy",
        key: "createdBy",
        editable: false,
        render: (value: IUser) => (
          <Typography.Link
            target="_blank"
            href={`http://localhost:3000/profile/${value?._id}`}
            ellipsis
          >
            {value?.username}
          </Typography.Link>
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: "20%",
        editable: false,
        render: (value: string) => (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
              tooltip: <>{value}</>,
            }}
            copyable
          >
            {value}
          </Typography.Paragraph>
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        editable: false,
        render: (value: Date) => <>{getFormatDate(value)}</>,
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        key: "updatedAt",
        editable: false,
        render: (value: Date) => (
          <Typography.Text>{getFormatDate(value)}</Typography.Text>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        editable: true,
        render: (value: "PENDING" | "REJECTED" | "APPROVED") => (
          <Typography.Text type={getStatusType(value)}>
            {value?.toUpperCase()}
          </Typography.Text>
        ),
      },
    ],
    []
  );
  const getInitialValues = useCallback(() => {
    if (!posts || activeIndex === undefined) return undefined;
    return posts[activeIndex];
  }, [posts, activeIndex]);
  const handleUpdatePost = async (value: any) => {
    if (activeIndex === undefined || !posts) return;
    const res = await updatePostById(posts[activeIndex]._id, {
      status: value?.status ?? "PENDING",
    });
    if (res && res.status === 200) {
      message.open({
        type: "success",
        content: "Update post succesfully",
        duration: 1,
      });
      if (posts[activeIndex].status !== value?.status) {
        setPosts((prev) => {
          if (!prev) return prev;
          return prev?.filter((item) => item._id !== value?._id);
        });
      }
    } else {
      const _res: any = res;
      message.open({
        type: "error",
        content: _res?.error?.message ?? "Update post failed",
        duration: 1,
      });
    }
    setEdit(false);
  };
  return (
    <>
      {contextHolder}
      <QueryBuilder
        setQueryString={setQueryBuilder}
        populate={["createdBy,tags"]}
        regex={[
          {
            key: "title",
            name: "title",
            label: "Title",
          },
        ]}
        exact={[
          {
            key: "status",
            name: "status",
            label: "Status",
            options: [
              {
                value: "PENDING",
                label: "PENDING",
              },
              {
                value: "APPROVED",
                label: "APPROVED",
              },
              {
                value: "REJECTED",
                label: "REJECTED",
              },
            ],
          },
        ]}
        sort={[
          {
            value: "createdAt",
            label: "Created At",
          },
          {
            value: "title",
            label: "Title",
          },
        ]}
      />
      <TableHandler
        data={posts}
        setData={setPosts}
        fetchData={fetchPosts}
        columns={columns}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setEdit={setEdit}
        query={queryBuilder}
        style={{ marginTop: "24px" }}
      />

      {edit && (
        <Modal title="Edit status of post" open footer={<></>}>
          <Form initialValues={getInitialValues()} onFinish={handleUpdatePost}>
            {columns.map((column) => (
              <Form.Item
                label={column.title}
                name={column.dataIndex}
                key={column.key}
              >
                {column.dataIndex === "status" ? (
                  <Select
                    options={[
                      {
                        value: "PENDING",
                        label: "PENDING",
                      },
                      {
                        value: "APPROVED",
                        label: "APPROVED",
                      },
                      {
                        value: "REJECTED",
                        label: "REJECTED",
                      },
                    ]}
                  />
                ) : (
                  <Input disabled={!column.editable} />
                )}
              </Form.Item>
            ))}
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
    </>
  );
};

export default Posts;
