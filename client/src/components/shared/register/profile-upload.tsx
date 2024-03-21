import {
  Form,
  GetProp,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useState } from "react";
import { NextButton, PreviousButton, UploadButton } from "./buttons";
import { DoubleProps } from "../../../pages/register";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ProfileUpload: React.FC<DoubleProps> = ({ onNext, onPrev }) => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <h1>Upload your profile picture!</h1>
      <Form onFinish={(value) => onNext()}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginLeft: "24px",
          }}
        >
          <Upload
            style={{ marginLeft: "300px" }}
            name="avatar"
            maxCount={1}
            multiple={false}
            listType="picture-card"
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
          >
            <div style={{}}>
              <UploadButton />
            </div>
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
          <div
            style={{
              display: "flex",
              marginLeft: "36px",
              alignItems: "center",
            }}
          >
            <NextButton />
            <PreviousButton />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProfileUpload;
