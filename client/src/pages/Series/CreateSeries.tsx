import { Button, Col, Form, Input, Popover, Row, message } from "antd";
import TextEditor from "../../components/shared/Editor";
import { useContext, useEffect, useState } from "react";
import { toolbarOptions } from "../EditLayout/EditLayout";
import {
  createNewSeries,
  fetchSeriesWithPagination,
} from "../../services/seriesApi";
import TagDebounceSelect, { TagValue } from "../EditLayout/TagDebounceSelect";
import SeriesDebounceSelect, { PostValue } from "./SeriesDebounceSelect";
import { useNavigate } from "react-router-dom";
import UserStateContext from "../../context/users/UserContext";
import { handleErrorMessage } from "../../utils/handleErrorMessage";
import Publish from "../EditLayout/Publish";

const CreateSeries: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const { user } = useContext(UserStateContext);
  const [title, setTitle] = useState<string>("");
  const [showRemainingPart, setShowRemainingPart] = useState<boolean>(false);
  const [tags, setTags] = useState<TagValue[]>([]);
  const [posts, setPosts] = useState<PostValue[]>([]);
  const navigate = useNavigate();
  const [access, setAccess] = useState<"public" | "private">("public");
  const [showPopover, togglePopover] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    console.log(title.length, description.length);
    if (
      title.length >= 15 &&
      title.length <= 100 &&
      description.length >= 100 &&
      description.length <= 1000
    )
      setShowRemainingPart(true);
    else setShowRemainingPart(false);
  }, [title, description]);
  const handleCreateSeries = async () => {
    const res = await createNewSeries({
      title,
      description,
      access,
      posts: posts ? posts.map((item) => item.value) : [],
    });
    if (res?.status === 201) {
      message.success({
        content: "Create new series succesfully",
        duration: 1,
      });
      navigate(`/profile/${user?._id}/series`);
    } else handleErrorMessage(res, message);
  };

  return (
    <>
      {contextHolder}
      <Form layout="vertical">
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginTop: "30px" }}
        >
          <Col span={18}>
            <Form.Item
              label="Title:"
              key="title"
              rules={[
                {
                  min: 15,
                  max: 100,
                },
                {
                  validator: async (_, value: string) => {
                    const res = await fetchSeriesWithPagination(
                      1,
                      10,
                      `value=${value}`
                    );
                    if (res?.data?.data?.meta?.total) {
                      throw new Error("This title already exists");
                    }
                  },
                },
              ]}
              required
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your series"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item key="publish" label="Publish" required>
              <Popover
                style={{ overflow: "auto" }}
                trigger="click"
                open={showPopover}
                onOpenChange={(value: boolean) => togglePopover(value)}
                placement="top"
                content={
                  <div>
                    <Publish
                      access={access}
                      setAccess={setAccess}
                      onSubmit={handleCreateSeries}
                      type="post"
                    />
                  </div>
                }
              >
                <Button style={{ width: "100%" }}>Lưu</Button>
              </Popover>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Description:" required key="description">
              <TextEditor
                text={description}
                setText={setDescription}
                placeholder="Leave some descriptions about your series"
                toolbarOptions={toolbarOptions}
              />
            </Form.Item>
          </Col>

          {showRemainingPart && (
            <Col span={24} style={{ marginTop: "50px" }}>
              <Form.Item label="Add posts to the series" key="posts">
                <SeriesDebounceSelect posts={posts} setPosts={setPosts} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};

export default CreateSeries;
