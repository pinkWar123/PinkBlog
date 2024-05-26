import { useMemo, useState } from "react";
import PermisisonForm from "./PermissionForm";
import TableHandler from "../../../components/admin/TableHandler";
import { IPermission } from "../../../types/backend";
import { fetchPermissionsWithPagination } from "../../../services/permissionsApi";
import { renderMethodString } from "./PermissionEdit";
import QueryBuilder from "../../../components/admin/QueryBuilder";
import { MODULES } from "../../../constants/modules";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Permissions: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<IPermission[] | undefined>();
  const [addPermission, setAddPermission] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  const [query, setQuery] = useState<string>("");
  const columns = useMemo(
    () => [
      {
        title: "_id",
        dataIndex: "_id",
        key: "_id",
        editable: false,
      },
      {
        title: "Api path",
        dataIndex: "apiPath",
        key: "apiPath",
        editable: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        editable: true,
      },
      {
        title: "Method",
        dataIndex: "method",
        key: "method",
        editable: true,
        render: (value: "GET" | "PUT" | "POST" | "DELETE" | "PATCH") =>
          renderMethodString(value),
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
  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowForm(true)}
      >
        Add new permission
      </Button>
      <QueryBuilder
        setQueryString={setQuery}
        exact={[
          {
            key: "module",
            label: "Module",
            name: "module",
            options: MODULES?.map((module) => ({
              label: module,
              value: module,
            })),
          },
        ]}
      />
      <TableHandler
        data={permissions}
        setData={setPermissions}
        fetchData={fetchPermissionsWithPagination}
        columns={columns}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        query={query}
        setEdit={setEditForm}
      />
      {showForm && (
        <PermisisonForm
          onHide={() => setShowForm(false)}
          id={
            permissions && activeIndex !== undefined
              ? permissions[activeIndex]._id
              : ""
          }
        />
      )}
      {editForm && (
        <>
          <PermisisonForm
            onHide={() => setEditForm(false)}
            id={
              permissions && activeIndex !== undefined
                ? permissions[activeIndex]._id
                : ""
            }
            initialValues={
              permissions &&
              activeIndex !== undefined &&
              permissions[activeIndex]
            }
            type="edit"
          />
        </>
      )}
    </>
  );
};

export default Permissions;
