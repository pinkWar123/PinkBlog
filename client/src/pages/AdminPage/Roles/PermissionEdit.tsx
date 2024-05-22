import {
  Card,
  Col,
  Collapse,
  CollapseProps,
  Flex,
  Form,
  Row,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { IGroupedPermission } from "../../../types/backend";
import Meta from "antd/es/card/Meta";

interface PermissionEditProps {
  currentPermissions: string[] | undefined;
  setCurrentPermissions: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  groupedPermissions: IGroupedPermission[] | undefined;
}

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

const PermissionEdit: React.FC<PermissionEditProps> = ({
  currentPermissions,
  setCurrentPermissions,
  groupedPermissions,
}) => {
  const [activeAll, setActiveAll] = useState<boolean[]>([]);
  useEffect(() => {
    let values: boolean[] = [];
    groupedPermissions?.forEach((groupPermission) => {
      const permissions = groupPermission.permissions.map((item) => item._id);
      const isAllPermissionsActive = permissions.every((item) =>
        currentPermissions?.includes(item)
      );
      values.push(isAllPermissionsActive);
    });
    setActiveAll(values);
  }, [currentPermissions, groupedPermissions]);
  const handleActiveAll = (index: number) => {
    if (!groupedPermissions) return;
    const permissions = groupedPermissions[index].permissions.map(
      (item) => item._id
    );
    const newPermissions = currentPermissions
      ? [...currentPermissions]
      : undefined;
    if (newPermissions)
      permissions.forEach((permission) => {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }
      });
    setCurrentPermissions(newPermissions);
  };
  const handleInactiveAll = (index: number) => {
    setCurrentPermissions((prev) => {
      if (!prev || !groupedPermissions) return prev;
      const permissionsToRemove = groupedPermissions[index].permissions.map(
        (item) => item._id
      );
      return prev.filter((item) => !permissionsToRemove.includes(item));
    });
  };
  const items: CollapseProps["items"] = useMemo(() => {
    return groupedPermissions?.map((groupPermission, index) => ({
      key: groupPermission._id,
      label: groupPermission._id,
      extra: (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={activeAll[index]}
            onChange={(value: boolean) => {
              if (value === true) {
                handleActiveAll(index);
              } else handleInactiveAll(index);
            }}
          />
        </div>
      ),
      children: (
        <Row>
          {groupPermission.permissions.map((permission) => (
            <Col span={12} style={{ padding: "8px 8px" }}>
              <Card>
                <Meta
                  avatar={
                    <Form.Item name={permission._id} key={permission._id}>
                      <Switch
                        onChange={(value: boolean) => {
                          if (value === true) {
                            if (!currentPermissions?.includes(permission._id))
                              setCurrentPermissions((prev) =>
                                prev ? [...prev, permission._id] : prev
                              );
                          } else {
                            setCurrentPermissions((prev) =>
                              prev
                                ? prev.filter((item) => item !== permission._id)
                                : prev
                            );
                          }
                        }}
                        checked={currentPermissions?.includes(permission._id)}
                      />
                    </Form.Item>
                  }
                  title={permission.name}
                  description={
                    <Flex>
                      <span>{renderMethodString(permission.method)}</span>
                      <span>{permission.apiPath}</span>
                    </Flex>
                  }
                />
              </Card>
            </Col>
          ))}
          ,
        </Row>
      ),
    }));
  }, [groupedPermissions, currentPermissions, activeAll]);

  return (
    <Card>
      <Typography>
        <Typography.Title level={3}>Edit permissions</Typography.Title>
        <Typography.Paragraph>
          Edit permissions of each role
        </Typography.Paragraph>
      </Typography>
      <Collapse items={items}></Collapse>
    </Card>
  );
};

export default PermissionEdit;
