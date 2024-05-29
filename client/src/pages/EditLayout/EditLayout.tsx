import {
  Button,
  Col,
  Flex,
  Input,
  Layout,
  Popover,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { MainHeader } from "../../components/shared";
import ReactQuill from "react-quill";
import { useContext, useEffect, useState } from "react";
import TagDebounceSelect, { TagValue } from "./TagDebounceSelect";
import Publish from "./Publish";
import {
  createPost,
  fetchPostById,
  updatePostById,
} from "../../services/postsApi";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../components/shared/Editor";
import UserStateContext from "../../context/users/UserContext";

export const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const EditLayout: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [tags, setTags] = useState<TagValue[]>([]);
  const [access, setAccess] = useState<"public" | "private">("public");
  const { user } = useContext(UserStateContext);
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(id ? true : false);
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const res = await fetchPostById(id ?? "");
      const data = res?.data?.data;
      setTitle(data?.title ?? "");
      setValue(data?.content ?? "");
      setAccess(data?.access ?? "public");
      setTags(
        data?.tags?.map((tag) => ({ label: tag.value, value: tag._id })) ?? []
      );
      setLoading(false);
    };
    fetchPost();
  }, [id]);
  const [openPopover, togglePopover] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleOpenChange = (newOpen: boolean) => {
    togglePopover(newOpen);
  };
  console.log(value);
  const onSubmit = async () => {
    console.log(tags.map((tag) => tag.value));
    let res;
    if (!id)
      res = await createPost(
        title,
        value,
        tags.map((tag) => tag.value),
        access
      );
    else
      res = await updatePostById(id ?? "", {
        title,
        content: value,
        tags: tags.map((tag) => tag.value),
        access,
      });
    if (res && (+res.status === 201 || res?.status === 200)) {
      if (!id) navigate("/");
      else navigate(`/profile/${user?._id}`);
    }
  };
  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Layout style={{ backgroundColor: "white" }}>
        <MainHeader />
        <div style={{ width: "95%", margin: "0 auto" }}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title of the post"
            allowClear
            style={{ marginTop: "20px" }}
          />
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ marginTop: "30px" }}
          >
            <Col span={20}>
              <TagDebounceSelect tags={tags} setTags={setTags} />
            </Col>
            <Col span={4}>
              <Popover
                style={{ overflow: "auto" }}
                trigger="click"
                open={openPopover}
                onOpenChange={handleOpenChange}
                placement="top"
                content={
                  <div>
                    <Publish
                      access={access}
                      setAccess={setAccess}
                      onSubmit={onSubmit}
                      type="post"
                    />
                  </div>
                }
              >
                <Button style={{ width: "100%" }}>Lưu</Button>
              </Popover>
            </Col>
          </Row>
          <TextEditor
            text={value}
            setText={setValue}
            toolbarOptions={toolbarOptions}
          />
        </div>
      </Layout>
    </>
  );
};

export default EditLayout;
