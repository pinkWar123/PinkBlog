import { Button, Flex, Form, Input, Modal, Select, message } from "antd";
import ModalFooter from "../../../components/shared/ModalFooter";
import { useState } from "react";
import { CreatePermissionDto } from "../../../types/dtos";
import {
  createNewPermission,
  updatePermissionById,
} from "../../../services/permissionsApi";
import { handleErrorMessage } from "../../../utils/handleErrorMessage";
import { MODULES } from "../../../constants/modules";
import { METHODS } from "../../../constants/methods";

interface PermissionFormProps {
  onHide: () => void;
  initialValues?: any;
  type?: "add" | "edit";
  id: string;
}

const PermisisonForm: React.FC<PermissionFormProps> = ({
  onHide,
  initialValues,
  type = "add",
  id,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const onSubmit = async (value: any) => {
    let res;
    if (type === "add") res = await createNewPermission(value);
    else res = await updatePermissionById(id, value);
    if (res && (res.status === 201 || res.status === 200)) {
      message.success({ content: "Create permission successfully" });
    } else handleErrorMessage(res, message);
    onHide();
  };

  return (
    <>
      {contextHolder}
      <Modal open footer={<></>} title="Create new permission">
        <Form onFinish={onSubmit} initialValues={initialValues}>
          <Form.Item
            label="Name of permission"
            key="name"
            name="name"
            rules={[
              { max: 50, message: "Maximum length of permission's name is 50" },
              { required: true },
            ]}
          >
            <Input showCount max={50} />
          </Form.Item>
          <Form.Item
            label="Api path"
            key="apiPath"
            name="apiPath"
            required
            rules={[
              {
                validator: (_, value: string) => {
                  if (value.length > 0 && !value.startsWith("/"))
                    return Promise.reject("Api must begin with a slash");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input prefix="/api/v1" />
          </Form.Item>
          <Form.Item label="Module" key="module" name="module" required>
            <Select
              options={MODULES.map((module) => ({
                label: module,
                value: module,
              }))}
            />
          </Form.Item>
          <Form.Item label="Method" key="method" name="method" required>
            <Select
              options={METHODS.map((method) => ({
                label: method,
                value: method,
              }))}
            />
          </Form.Item>

          <ModalFooter onHide={onHide} loading={loading} />
        </Form>
      </Modal>
    </>
  );
};

export default PermisisonForm;
