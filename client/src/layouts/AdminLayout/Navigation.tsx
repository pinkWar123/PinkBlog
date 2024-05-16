import React, { useMemo } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

// const items: MenuItem[] = [
//   {
//     key: "sub1",
//     label: "Navigation One",
//     icon: <MailOutlined />,
//     onClick: () => alert("ahihi"),
//     children: [
//       {
//         key: "g1",
//         label: "Item 1",
//         type: "group",
//         children: [
//           { key: "1", label: "Option 1" },
//           { key: "2", label: "Option 2" },
//         ],
//       },
//       {
//         key: "g2",
//         label: "Item 2",
//         type: "group",
//         children: [
//           { key: "3", label: "Option 3" },
//           { key: "4", label: "Option 4" },
//         ],
//       },
//     ],
//   },
//   {
//     key: "sub2",
//     label: "Navigation Two",
//     icon: <AppstoreOutlined />,
//     children: [
//       { key: "5", label: "Option 5" },
//       { key: "6", label: "Option 6" },
//       {
//         key: "sub3",
//         label: "Submenu",
//         children: [
//           { key: "7", label: "Option 7" },
//           { key: "8", label: "Option 8" },
//         ],
//       },
//     ],
//   },
//   {
//     type: "divider",
//   },
//   {
//     key: "sub4",
//     label: "Navigation Three",
//     icon: <SettingOutlined />,
//     children: [
//       { key: "9", label: "Option 9" },
//       { key: "10", label: "Option 10" },
//       { key: "11", label: "Option 11" },
//       { key: "12", label: "Option 12" },
//     ],
//   },
//   {
//     key: "grp",
//     label: "Group",
//     type: "group",
//     children: [
//       { key: "13", label: "Option 13" },
//       { key: "14", label: "Option 14" },
//     ],
//   },
// ];

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const items: MenuItem[] = useMemo(
    () => [
      {
        key: "users",
        label: "Users",
        icon: <UserOutlined />,
        onClick: () => navigate("/admin/users"),
      },
      {
        key: "tags",
        label: "Tags",
        icon: <TagOutlined />,
        onClick: () => navigate("/admin/tags"),
      },
      {
        key: "roles",
        label: "Roles",
        icon: <TeamOutlined />,
        onClick: () => navigate("/admin/roles"),
      },
    ],
    [navigate]
  );
  return (
    <Menu
      style={{ width: 200, minHeight: "100vh" }}
      defaultSelectedKeys={[location.pathname.split("/").pop() ?? ""]}
      mode="inline"
      items={items}
    />
  );
};

export default Navigation;
