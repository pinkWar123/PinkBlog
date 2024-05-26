import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Flex,
  Form,
  Input,
  Modal,
  Switch,
  Typography,
  message,
} from "antd";
import { IGroupedPermission, IRole } from "../../../types/backend";
import {
  createNewRole,
  fetchRoles,
  fetchRolesByName,
  updateRoleById,
} from "../../../services/rolesApi";
import PermissionEdit from "../Permissions/PermissionEdit";
import { useState } from "react";

interface RoleFormProps {
  initialValues: IRole | undefined;
  initialPermissions: string[] | undefined;
  layout?: "vertical" | "horizontal" | "inline";
  title: string;
  onClose: () => void;
  onFormFinish: (id?: string) => Promise<void>;
  groupedPermissions: IGroupedPermission[] | undefined;
}

const RoleForm: React.FC<RoleFormProps> = ({
  initialValues,
  initialPermissions,
  layout = "vertical",
  title,
  onClose,
  onFormFinish,
  groupedPermissions,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPermissions, setCurrentPermissions] = useState<
    string[] | undefined
  >(initialPermissions);
  const onFinish = async (value: any) => {
    const { name, description, isActive } = value;
    let res;
    if (initialValues?._id) {
      res = await updateRoleById(initialValues?._id, {
        name,
        description,
        isActive,
        permissions: currentPermissions ?? [],
      });
      await onFormFinish();
    } else {
      res = await createNewRole({
        name,
        description,
        isActive,
        permissions: currentPermissions ?? [],
      });
      console.log(res?.data?.data?._id);
      await onFormFinish(res?.data?.data?._id);
    }

    if (res && (res.status === 200 || res.status === 201)) {
      message.open({
        type: "success",
        content: "Update user successfully",
        duration: 1,
      });
    } else {
      const _res: any = res;
      message.open({
        type: "error",
        content: _res?.error?.message,
        duration: 1,
      });
    }

    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal open footer={<></>} title={title} width="70%">
        <Form initialValues={initialValues} onFinish={onFinish} layout={layout}>
          {initialValues?._id && (
            <Form.Item label="_id" name="_id" key="_id">
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            label="Name"
            name="name"
            key="name"
            validateDebounce={500}
            rules={[
              {
                type: "string",
                min: 1,
                // max: 10,
              },
              {
                validator: async (_, value: string) => {
                  if (value.length === 0)
                    throw new Error("Empty name is not allowed");
                  if (value === initialValues?.name) return;
                  const res = await fetchRolesByName(value);
                  if (res && res.data.data && res.data.data?.meta.total > 0)
                    throw new Error(`${value} has already existed`);
                },
              },
            ]}
          >
            <Input required />
          </Form.Item>

          <Form.Item label="Description" name="description" key="description">
            <Input />
          </Form.Item>

          <Form.Item label="Active" name="isActive" key="isActive">
            <Switch />
          </Form.Item>

          <PermissionEdit
            groupedPermissions={groupedPermissions}
            currentPermissions={currentPermissions}
            setCurrentPermissions={setCurrentPermissions}
          />

          <Flex justify="flex-end" gap="small" style={{ marginTop: "24px" }}>
            <Form.Item key="cancel">
              <Button type="dashed" title="Cancel" onClick={onClose}>
                Cancel
              </Button>
            </Form.Item>

            <Form.Item key="update">
              <Button type="primary" title="Update" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default RoleForm;
