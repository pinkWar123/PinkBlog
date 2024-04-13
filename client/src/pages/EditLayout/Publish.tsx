import { GlobalOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Divider, Radio, Space } from "antd";
import { useState } from "react";

const buttonStyle = {
  marginTop: "12px",
  paddingBottom: "12px",
};

interface IProps {
  access: string;
  setAccess: (value: "public" | "private") => void;
  onSubmit: () => void;
}

interface PublishProps {
  onSubmit: () => void;
}

const Public: React.FC<PublishProps> = ({ onSubmit }) => {
  return (
    <>
      <div>
        <GlobalOutlined /> Mọi người có thể nhìn thấy bài viết của bạn
      </div>
      <Button style={buttonStyle} onClick={onSubmit}>
        Xuất bản
      </Button>
    </>
  );
};

const OnlyMe: React.FC<PublishProps> = ({ onSubmit }) => {
  return (
    <>
      <div>
        <LockOutlined /> Chỉ có bạn mới có thể xem bài viết này. Bản nháp của
        bạn đã được lưu tự động khi bạn nhập
      </div>
      <Button style={buttonStyle} onClick={onSubmit}>
        Lưu
      </Button>
    </>
  );
};

const Publish: React.FC<IProps> = ({ access, setAccess, onSubmit }) => {
  const renderPublishOption = () => {
    switch (access) {
      case "public":
        return <Public onSubmit={onSubmit} />;
      case "private":
        return <OnlyMe onSubmit={onSubmit} />;
    }
  };
  return (
    <div style={{ width: "350px" }}>
      Xuất bản bài viết của bạn
      <br />
      <strong>Giấy phép: </strong>
      All rights reserved
      <p>Hiển thị:</p>
      <Radio.Group
        defaultValue={"public"}
        value={access}
        onChange={(e) => setAccess(e.target.value)}
      >
        <Space direction="vertical">
          <Radio value={"public"}>Công khai</Radio>
          <Radio value={"private"}>Chỉ mình tôi</Radio>
        </Space>
      </Radio.Group>
      <Divider />
      <div style={{ width: "100%" }}>{renderPublishOption()}</div>
    </div>
  );
};

export default Publish;
