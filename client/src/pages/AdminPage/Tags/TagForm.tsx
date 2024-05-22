import {
  Button,
  Card,
  ColorPicker,
  Flex,
  Form,
  GetProp,
  Image,
  Input,
  Modal,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { getTagByValue, uploadTagImage } from "../../../services/tagsApi";
import { rgbToHex } from "../../../utils/colorConvert";
import { Color } from "antd/es/color-picker";
import { useState } from "react";
import axiosInstance from "../../../services/config";
import { uploadSingleFile } from "../../../services/uploadApi";
import { IBackendRes, ITag, IUpdateResponse } from "../../../types/backend";
import ModalFooter from "../../../components/shared/ModalFooter";

interface TagFormProps {
  type: "edit" | "add";
  title: string;
  footer?: React.ReactElement;
  initialValues?: any;
  onFinish: (value: any) => Promise<any>;
  onHide: () => void;
}

interface DisplayProps {
  value: string;
  color: string;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const TagForm: React.FC<TagFormProps> = ({
  title,
  footer,
  initialValues,
  onFinish,
  onHide,
  type,
}) => {
  const isEditForm = type === "edit";
  const [displayData, setDisplayData] = useState<DisplayProps | undefined>(
    () => {
      const defaultValue = initialValues?.value;
      const defaultColor = initialValues?.color;
      return {
        value: defaultValue ?? "Tag",
        color: defaultColor ? `#${defaultColor}` : "magenta",
      };
    }
  );
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialValues?.image && [
      {
        uid: "default",
        url: initialValues?.image.url,
      },
    ]
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      {contextHolder}
      <Modal open title={title} footer={footer ?? <></>}>
        <Form
          initialValues={initialValues}
          onFinish={async (value: any) => {
            setLoading(true);
            const color: Color = value?.color?.metaColor;
            const dto = { ...value };
            if (color) dto.color = color.toHex(true);
            const image =
              fileList.length > 0 ? (fileList[0] as FileType) : undefined;
            const bodyFormData = new FormData();
            if (image && image.uid !== "default")
              bodyFormData.append("file", image as FileType);
            Object.entries(dto)?.forEach(([key, value]) => {
              if (key && value) bodyFormData.append(key, value as string);
            });
            const config = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };
            let res;
            if (type === "add")
              res = await axiosInstance.post<IBackendRes<ITag>>(
                "/tags",
                bodyFormData,
                config
              );
            else
              res = await axiosInstance.patch<IBackendRes<IUpdateResponse>>(
                `/tags/${value._id}`,
                bodyFormData,
                config
              );
            if (res && (res.status === 200 || res.status === 201)) {
              message.success({
                content: `${type} tag successfully`,
              });
            }
            await onFinish(res);
            setLoading(false);
            onHide();
          }}
        >
          {isEditForm && (
            <Form.Item name="_id" label="_id">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="value"
            label="Value"
            validateDebounce={500}
            rules={[
              {
                type: "string",
                min: 1,
                max: 50,
              },
              {
                required: true,
                message: "Value must not be empty",
              },
              {
                validator: async (_, value: string) => {
                  const hasTagExisted = await getTagByValue(value);
                  if (
                    hasTagExisted &&
                    hasTagExisted.data.data &&
                    hasTagExisted?.data.data?.meta?.total > 0
                  )
                    throw new Error(`Tag ${value} has already existed`);
                },
              },
            ]}
          >
            <Input
              count={{
                show: true,
                max: 50,
              }}
              onChange={(e) =>
                setDisplayData({
                  color: displayData?.color ?? "magenta",
                  value: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            key="description"
            rules={[{ type: "string", max: 500 }]}
            tooltip="This is your personal brief description. Feel free to let others know a bit about you."
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              count={{
                show: true,
                max: 500,
              }}
            />
          </Form.Item>

          <Form.Item label="Color" key="color" name="color">
            <ColorPicker
              showText
              format="hex"
              onChange={(_, hex: string) =>
                setDisplayData({
                  color: hex,
                  value: displayData?.value ?? "Tag",
                })
              }
            />
          </Form.Item>
          <Upload
            accept="image/*"
            listType="picture-card"
            defaultFileList={fileList}
            fileList={fileList}
            maxCount={1}
            beforeUpload={(file) => {
              setFileList([file]);
              return false;
            }}
            onRemove={(file) => {
              const index = fileList.indexOf(file);
              const newFileList = fileList.slice();
              newFileList.splice(index, 1);
              setFileList(newFileList);
            }}
          >
            +Upload
          </Upload>
          <Card>
            <Tag color={displayData?.color}>{displayData?.value}</Tag>
          </Card>

          <ModalFooter
            loading={loading}
            onHide={onHide}
            okText={type === "add" ? "Create" : "Edit"}
          />
        </Form>
      </Modal>
    </>
  );
};

export default TagForm;
