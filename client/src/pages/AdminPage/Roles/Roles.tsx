import { useCallback, useEffect, useMemo, useState } from "react";
import { IGroupedPermission, IRole } from "../../../types/backend";
import TableHandler from "../../../components/admin/TableHandler";
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import {
  deleteRoleById,
  fetchRoleById,
  fetchRoles,
  updateRoleById,
} from "../../../services/rolesApi";
import { getGroupedPermissions } from "../../../services/permissionsApi";
import { Store } from "antd/es/form/interface";
import RoleForm from "./RoleForm";
import { PlusOutlined } from "@ant-design/icons";
const { Meta } = Card;

const renderMethodString = (
  method: "GET" | "PUT" | "POST" | "DELETE" | "PATCH"
) => {
  const getColor = (method: string) => {
    switch (method) {
      case "GET":
        return "#61affe";
      case "POST":
        return "#49cc90";
      case "PATCH":
        return "#50e3c2";
      case "DELETE":
        return "#f93e3e";
    }
  };
  return (
    <Tag color={getColor(method)}>
      <span style={{ fontWeight: "600", fontSize: "14px", padding: "4px" }}>
        {method}
      </span>
    </Tag>
  );
};

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<IRole[] | undefined>();
  const [edit, setEdit] = useState<boolean>(false);
  const [addRole, setAddRole] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  const [groupedPermissions, setGroupedPermissions] = useState<
    IGroupedPermission[] | undefined
  >();

  const columns = useMemo(
    () => [
      {
        title: "_id",
        dataIndex: "_id",
        key: "_id",
        editable: false,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        editable: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        editable: true,
      },
      {
        title: "Active",
        dataIndex: "isActive",
        key: "isActive",
        editable: true,
        render: (value: boolean) => <Switch value={value} disabled></Switch>,
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        editable: true,
      },
    ],
    []
  );
  const getInitialValues = useCallback(() => {
    if (!roles || activeIndex === undefined) return;
    return roles[activeIndex];
  }, [activeIndex, roles]);
  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await getGroupedPermissions();
      console.log(res);
      if (res && res.status === 200) {
        setGroupedPermissions(res.data.data);
      }
    };
    fetchPermissions();
  }, []);

  const getInitialPermissions = useCallback(() => {
    if (roles && activeIndex !== undefined) {
      return roles[activeIndex].permissions;
    }
  }, [activeIndex, roles]);

  const onFormFinish = async (id?: string) => {
    if (!id) {
      if (!roles || activeIndex === undefined) return;
      const res = await fetchRoleById(roles[activeIndex]._id);
      if (res && res.status === 200) {
        setRoles((prev) => {
          if (!prev) return prev;
          return prev?.map((element, index) => {
            if (index === activeIndex && res.data.data !== undefined)
              return {
                ...res.data.data,
                permissions: res.data.data.permissions.map(
                  (permission) => permission._id
                ),
              };
            return element;
          });
        });
      }
    } else {
      const res = await fetchRoleById(id);
      console.log(res);
      if (res && res.status === 200) {
        setRoles((prev) => {
          if (!prev || !res.data.data) return prev;
          const newRole: IRole = {
            ...res.data.data,
            permissions:
              res.data.data?.permissions.map((item) => item._id) ?? [],
          };
          return [newRole, ...prev];
        });
      }
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setAddRole(true)}
      >
        Add new role
      </Button>
      <TableHandler
        data={roles}
        setData={setRoles}
        columns={columns}
        fetchData={fetchRoles}
        setEdit={setEdit}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        deleteData={deleteRoleById}
      />
      {edit && (
        <RoleForm
          initialValues={getInitialValues()}
          title="Edit role"
          onClose={() => setEdit(false)}
          onFormFinish={onFormFinish}
          initialPermissions={getInitialPermissions()}
          groupedPermissions={groupedPermissions}
        />
      )}
      {addRole && (
        <RoleForm
          initialValues={undefined}
          title="Add new role"
          onClose={() => setAddRole(false)}
          onFormFinish={onFormFinish}
          initialPermissions={[]}
          groupedPermissions={groupedPermissions}
        />
      )}
    </>
  );
};

export default Roles;
