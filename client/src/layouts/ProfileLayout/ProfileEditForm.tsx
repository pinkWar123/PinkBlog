import {
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  UploadFile,
  message,
} from "antd";
import { IBackendRes, IUpdateResponse, IUser } from "../../types/backend";
import {
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../../services/usersApi";
import DelayUpload from "../../components/shared/DelayUpload";
import { useContext, useState } from "react";
import ModalFooter from "../../components/shared/ModalFooter";
import { FileType } from "../../types/antd-type";
import axiosInstance from "../../services/config";
import { handleErrorMessage } from "../../utils/handleErrorMessage";
import UserStateContext from "../../context/users/UserContext";

interface ProfileEditFormProps {
  user: IUser;
  onHide: () => void;
  resetUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onHide,
  resetUser,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "default",
      name: "default",
      url: user.profileImageUrl,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useContext(UserStateContext);
  const [messageApi, contextHolder] = message.useMessage();
  console.log(user);
  return (
    <Modal open={true} title="Edit profile" footer={null}>
      {contextHolder}
      <Form
        initialValues={user}
        layout="vertical"
        onFinish={async (value: IUser) => {
          console.log(value);
          const image =
            fileList?.length > 0 ? (fileList[0] as FileType) : undefined;
          const bodyFormData = new FormData();
          if (image && image.uid !== "default")
            bodyFormData.append("file", image as FileType);

          Object.entries(value)?.forEach(([key, value]) => {
            if (key && value)
              bodyFormData.append(
                key,
                typeof value === "number" ? value.toString() : value
              );
          });
          // bodyFormData.append("age", "9");
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          setLoading(true);
          const res = await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
            `/users/${user._id}`,
            bodyFormData,
            config
          );
          setLoading(false);
          if (res && res.status === 200) {
            const newUser = await getUserById(user._id);
            if (newUser) {
              resetUser(newUser?.data?.data);
              setUser(newUser?.data?.data);
            }
            message.success({ content: "Updated user successfully" });
          } else handleErrorMessage(res, message);
          onHide();
        }}
      >
        <Form.Item label="Username" key="username" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Description" key="description" name="description">
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            count={{
              show: true,
              max: 500,
            }}
          />
        </Form.Item>
        <Form.Item label="Age" key="age" name="age">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="Email"
          key="email"
          name="email"
          rules={[
            {
              required: false,
              type: "email",
              message: "Please enter a valid email address",
            },
            {
              validator: async (_, value: string) => {
                if (value === user.email) return Promise.resolve();
                const result = await getUserByEmail(value);
                if (result?.data?.data?.meta?.total) {
                  return Promise.reject("This email already exists");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Profile image">
          <DelayUpload fileList={fileList} setFileList={setFileList} />
        </Form.Item>

        <ModalFooter loading={loading} onHide={onHide} />
      </Form>
    </Modal>
  );
};

export default ProfileEditForm;
