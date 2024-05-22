import React, { useEffect, useState } from "react";
import { Button, Flex, Modal, Table, Tooltip, message } from "antd";
import type { GetProp, TableProps } from "antd";
import { IBackendRes, IPagination } from "../../types/backend";
import { AxiosResponse } from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type ColumnsType<AnyObject> = TableProps<AnyObject>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

interface TableHandlerProps<AnyObject> extends TableProps<AnyObject> {
  data: AnyObject[] | undefined;
  setData: React.Dispatch<React.SetStateAction<AnyObject[] | undefined>>;
  fetchData: (
    qs?: string
  ) => Promise<AxiosResponse<IBackendRes<IPagination<AnyObject>>, any> | null>;
  columns: ColumnsType<AnyObject>;
  deleteData?: (
    id: string
  ) => Promise<AxiosResponse<IBackendRes<{ deleted: number }>> | null>;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  activeIndex: number | undefined;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  query?: string;
}

function TableHandler({
  data,
  setData,
  fetchData,
  columns,
  deleteData,
  setEdit,
  activeIndex,
  setActiveIndex,
  query,
  ...rest
}: TableHandlerProps<any>) {
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [modalOpen, toggleModal] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const fetchTableData = async () => {
    setLoading(true);
    const current = tableParams.pagination?.current ?? 1;
    const pageSize = tableParams.pagination?.pageSize ?? 10;
    const queryString = query
      ? `${query}&current=${current}&pageSize=${pageSize}`
      : `current=${current}&pageSize=${pageSize}`;
    const res: AxiosResponse<IBackendRes<IPagination<any>>, any> | null =
      await fetchData(queryString);
    setData(res?.data.data?.result);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: res?.data.data?.meta.total,
      },
    });
  };

  useEffect(() => {
    const handleQueryChange = async () => {
      if (!query) return;
      setLoading(true);
      const queryString = `${query}&current=1&pageSize=10`;
      const res: AxiosResponse<IBackendRes<IPagination<any>>, any> | null =
        await fetchData(queryString);
      setData(res?.data.data?.result);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: 10,
        },
      });
    };
    handleQueryChange();
  }, [query]);

  useEffect(() => {
    fetchTableData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleTableChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleDeleteData = async () => {
    if (!deleteData || activeIndex === undefined || !data) return;
    const res: any = await deleteData(data[activeIndex]._id);
    if (res?.status !== 200) {
      message.open({
        type: "error",
        content: res?.error?.message,
        duration: 1,
      });
    } else {
      fetchTableData();
      message.open({
        type: "success",
        content: "Delete user succesfully",
        duration: 1,
      });
    }
    toggleModal(false);
  };

  const editColumn = {
    key: "edit",
    render: (value: any) => {
      const index = data?.findIndex((item) => item._id === value._id);
      return (
        <Flex gap="middle">
          <Tooltip title="Edit">
            <EditOutlined
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                if (index !== -1) {
                  setActiveIndex(index);
                  if (setEdit) setEdit((prev) => !prev);
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => {
                toggleModal(true);
                setActiveIndex(index);
              }}
            />
          </Tooltip>
        </Flex>
      );
    },
  };
  const tableColumns = [...(columns as any[]), editColumn] as ColumnsType<any>;

  return (
    <>
      {contextHolder}
      <Table
        columns={tableColumns}
        rowKey={(record) => record._id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        {...rest}
      />
      <Modal
        open={modalOpen}
        title="Delete"
        footer={[
          <Button onClick={() => toggleModal(false)}>Cancel</Button>,
          <Button type="primary" onClick={handleDeleteData}>
            Confirm
          </Button>,
        ]}
      >
        Are you sure you want to delete this?
      </Modal>
    </>
  );
}

export default TableHandler;
