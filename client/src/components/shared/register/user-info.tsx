import { FormProps, Input, InputNumber } from "antd";
import { Form } from "antd";
import { NextButton } from "./buttons";
import { SingleProps } from "../../../pages/auth/register";
import { checkUserAccount } from "../../../services/authApi";
import { useContext } from "react";
import RegisterStateContext from "../../../context/register/RegisterContext";

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

type FieldType = {
  username: string;
  password: string;
  confirm?: string;
  description?: string;
  email?: string;
  age: number;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const UserInfo: React.FC<SingleProps> = ({ onNext }) => {
  const [form] = Form.useForm();
  const { registerInfo, setRegisterInfo } = useContext(RegisterStateContext);
  console.log(registerInfo);
  const onFinish: FormProps<FieldType>["onFinish"] = (values: FieldType) => {
    const { confirm, ...rest } = values;
    setRegisterInfo(rest);
    onNext();
  };
  return (
    <>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          paddingBottom: "24px",
          marginTop: "20px",
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
          //onNext();
        }}
        onFinishFailed={onFinishFailed}
        //style={{ maxWidth: "600" }}
        scrollToFirstError
      >
        <Form.Item<FieldType>
          name="username"
          label="Username"
          initialValue={registerInfo?.username}
          validateDebounce={500}
          rules={[
            { required: true, message: "Username can't be empty" },
            {
              validator: async (_, value: string) => {
                if (value.length === 0) return;
                const result = await checkUserAccount(value);
                console.log(result.data.data);
                if (result.data.data) {
                  throw new Error("This username already exists");
                }
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          label="Password"
          hasFeedback
          initialValue={registerInfo?.password}
          rules={[{ required: true, message: "Password can't be empty" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="confirm"
          label="Confirm"
          dependencies={["password"]}
          hasFeedback
          initialValue={registerInfo?.password}
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
          initialValue={registerInfo?.age}
          rules={[{ required: true, message: "Please enter a valid age" }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          initialValue={registerInfo?.email}
          rules={[
            {
              required: false,
              message: "Please enter a valid email",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          initialValue={registerInfo?.description}
          tooltip="Leave some information about yourself so that others can understand you better"
        >
          <Input.TextArea showCount maxLength={1000} />
        </Form.Item>

        <NextButton onClick={(e) => console.log(e)} />
      </Form>
    </>
  );
};

export default UserInfo;
