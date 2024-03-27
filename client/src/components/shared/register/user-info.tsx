import { FormProps, Input, InputNumber } from "antd";
import { Form } from "antd";
import { NextButton } from "./buttons";
import { SingleProps } from "../../../pages/auth/register";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

type FieldType = {
  username?: string;
  password?: string;
  confirm?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log(values);
};

const UserInfo: React.FC<SingleProps> = ({ onNext }) => {
  const [form] = Form.useForm();
  return (
    <>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          paddingBottom: "24px",
        }}
      >
        Đăng ký
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(value) => {
          onFinish(value);
          onNext();
        }}
        style={{ maxWidth: "600" }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Username can't be empty" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          hasFeedback
          rules={[{ required: true, message: "Password can't be empty" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(
                  new Error("The password you entered does not match")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter a valid age" }]}
        >
          <InputNumber />
        </Form.Item>
        <NextButton onClick={(e) => console.log(e)} />
      </Form>
    </>
  );
};

export default UserInfo;
