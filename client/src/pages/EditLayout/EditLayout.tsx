import { Button, Col, Flex, Input, Popover, Row, Select, Space } from "antd";
import { MainHeader } from "../../components/shared";
import ReactQuill from "react-quill";
import { useState } from "react";
import TagDebounceSelect, { TagValue } from "./TagDebounceSelect";
import Publish from "./Publish";
import { createPost } from "../../services/postsApi";
import { useNavigate } from "react-router-dom";

const toolbarOptions = [
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
  const [openPopover, togglePopover] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleOpenChange = (newOpen: boolean) => {
    togglePopover(newOpen);
  };
  const onSubmit = async () => {
    const res = await createPost(
      title,
      value,
      tags.map((tag) => tag.value),
      access
    );
    if (res && +res.status === 201) {
      navigate("/profile");
    }
  };
  return (
    <>
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
                  />
                </div>
              }
            >
              <Button style={{ width: "100%" }}>Lưu</Button>
            </Popover>
          </Col>
        </Row>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={{ toolbar: toolbarOptions }}
          placeholder="Write something ..."
          style={{ marginTop: "30px", height: "60vh" }}
        />
      </div>
    </>
  );
};

export default EditLayout;
