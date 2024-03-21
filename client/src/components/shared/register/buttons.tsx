import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { MouseEventHandler } from "react";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLElement>;
  htmlType?: "submit" | "reset" | "button";
};
const NextButton: React.FC<ButtonProps> = ({ onClick, htmlType }) => {
  return (
    <Button
      type="primary"
      htmlType={htmlType ? htmlType : "submit"}
      onClick={onClick}
    >
      Next
    </Button>
  );
};

const PreviousButton: React.FC<ButtonProps> = ({ onClick, htmlType }) => {
  return (
    <Button
      style={{ marginLeft: "12px" }}
      type="default"
      htmlType={htmlType ? htmlType : "submit"}
      onClick={onClick}
    >
      Previous
    </Button>
  );
};

const UploadButton: React.FC = () => (
  <div>
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="submit"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  </div>
);

export { NextButton, PreviousButton, UploadButton };
