import TableHandler from "../../components/admin/TableHandler";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IRole, IUser } from "../../types/backend";
import {
  deleteUserById,
  fetchUsersWithPagination,
  getUserById,
  updateUserById,
} from "../../services/usersApi";
import { getFormatDate } from "../../utils/formateDate";
import { ColumnsType } from "./type";
import { fetchRoles } from "../../services/rolesApi";
import { PlusOutlined } from "@ant-design/icons";
import { Store } from "antd/es/form/interface";
import { formItems } from "../../components/shared/register/user-info";
import { register } from "../../services/authApi";
import { UserRegisterDto } from "../../types/auth";

interface IUserForm {
  _id: string;
  username: string;
  age: number;
  role: {
    _id: string;
    name: string;
  };
}

const User: React.FC = () => {
  const [data, setData] = useState<IUser[] | undefined>();
  const [edit, setEdit] = useState<boolean>(false);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  const [roles, setRoles] = useState<IRole[] | undefined>();
  useEffect(() => {
    const fetchAllRoles = async () => {
      const res = await fetchRoles();
      console.log(res);
      if (res && res.status === 200) {
        setRoles(res.data.data?.result);
      }
    };
    fetchAllRoles();
  }, []);
  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      key: "_id",
      editable: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      filters: [],
      filterSearch: true,
      onFilter: (value: any, record: any) =>
        record.username.startsWith(value as string),
      editable: false,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a: any, b: any) => a.age - b.age,
      editable: true,
      type: "number",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      render: (role: { _id: string; name: string }) => {
        if (!edit)
          return (
            <Tag style={{ fontSize: "14px", padding: "4px" }}>
              <span style={{ padding: "4px" }}>
                {role ? role.name?.toUpperCase() : "ANY"}
              </span>
            </Tag>
          );
      },
      editable: true,
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (createdAt: Date) => getFormatDate(new Date(createdAt)),
      editable: false,
    },
    {
      title: "Updated At",
      key: "updatedAt",
      dataIndex: "updatedAt",
      render: (updatedAt: Date) => getFormatDate(new Date(updatedAt)),
      editable: false,
    },
  ];

  const getInitialValues = useCallback(() => {
    console.log(activeIndex);
    if (!data || activeIndex === undefined) return undefined;
    let initialValues = data[activeIndex];
    return {
      ...initialValues,
      role: initialValues.role._id,
    };
  }, [activeIndex, data]);

  const onFinish = async (value: IUser) => {
    console.log("onFinish", value);
    const _id = getInitialValues()?._id;
    if (_id) {
      const res = await updateUserById(_id, value);
      if (res && res.status === 200) {
        const newUser = await getUserById(_id);
        console.log(newUser);
        if (newUser && newUser.data.data) {
          setData((prev) => {
            if (!prev) return prev;
            return prev.map((item) => {
              if (item._id === _id) return newUser.data.data as IUser;
              return item;
            });
          });
        }
        setEdit(false);
      }
    }
  };

  const handleAddUser = async (user: UserRegisterDto) => {
    const res = await register(user);
    console.log(res?.data.data);
    if (res && res.status === 201) {
      const user = await getUserById(res.data.data?._id ?? "");
      if (user) {
        setData((prev) => {
          if (!prev || !user.data.data) return prev;
          return [...prev, user.data.data];
        });
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setAddUser(true)}
      >
        Add user
      </Button>
      <TableHandler
        data={data}
        setData={setData}
        activeIndex={activeIndex}
        setEdit={setEdit}
        setActiveIndex={setActiveIndex}
        fetchData={fetchUsersWithPagination}
        columns={columns as ColumnsType<IUser>}
        deleteData={deleteUserById}
        style={{ marginTop: "12px" }}
      />
      {edit && (
        <Modal open onCancel={() => setEdit(false)} title="Edit user">
          <EditUserForm
            initialValues={getInitialValues()}
            roles={roles}
            onFinish={onFinish}
          />
        </Modal>
      )}
      {addUser && (
        <Modal open onCancel={() => setAddUser(false)} title="Add a new user">
          <AddUserForm
            roles={roles ?? []}
            handleAddUser={handleAddUser}
            onCloseModal={() => setAddUser(false)}
          />
        </Modal>
      )}
    </>
  );
};

interface UserFormEditProps {
  initialValues: Store | undefined;
  onFinish: (value: IUser) => Promise<void>;
  roles: IRole[] | undefined;
}

const EditUserForm: React.FC<UserFormEditProps> = ({
  initialValues,
  onFinish,
  roles,
}) => {
  return (
    <Form initialValues={initialValues} onFinish={onFinish}>
      <Form.Item<IUserForm> label="Username" name="username">
        <Input />
      </Form.Item>

      <Form.Item<IUserForm> label="Age" name="age">
        <InputNumber />
      </Form.Item>

      <Form.Item<IUserForm> label="Role" name="role">
        <Select
          options={roles?.map((role) => ({
            value: role._id,
            label: role.name,
          }))}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

interface AddUserFormProps {
  roles: { _id: string; name: string }[];
  handleAddUser: (user: UserRegisterDto) => Promise<boolean>;
  onCloseModal: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  roles,
  handleAddUser,
  onCloseModal,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (value: UserRegisterDto) => {
    const isAddUserSuccessful = await handleAddUser(value);
    message.open({
      type: isAddUserSuccessful ? "success" : "error",
      content: isAddUserSuccessful
        ? "Add user successfully"
        : "Add user failed",
      duration: 1,
    });
    if (isAddUserSuccessful) onCloseModal();
  };
  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish}>
        {formItems(undefined)}
        <Form.Item name="role" label="Role">
          <Select
            options={roles?.map((role) => ({
              value: role._id,
              label: role.name,
            }))}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default User;
