import { Col, Pagination, PaginationProps, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaginationHandlerProps {
  fetchData: (page: number) => Promise<
    | {
        pageSize: number;
        pages: number;
        total: number;
      }
    | undefined
  >;
  module?: string;
  children: React.ReactElement;
}

const PaginationHandler: React.FC<PaginationHandlerProps> = ({
  fetchData,
  module,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const fetchDataWithPagination = useCallback(
    (page: number) => {
      const fetchPageData = async (page: number) => {
        const meta = await fetchData(page);
        setTotal(meta?.total ?? 0);
        setPageSize(meta?.pageSize ?? 0);
        setCurrent(page);
      };
      fetchPageData(page);
    },
    [fetchData]
  );
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchDataWithPagination(page);
  }, [location.search, fetchData, fetchDataWithPagination]);
  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    console.log("Page: ", pageNumber);
    if (module) navigate(`/${module}?page=${pageNumber}`);
    else navigate(`?page=${pageNumber}`);
    // window.location.href = `localhost:3000/${type}?page=${pageNumber}`;
    fetchDataWithPagination(pageNumber);
  };
  return (
    <Row style={{ width: "100%" }}>
      <Col span={24}>{children}</Col>
      <Col span={24}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "85%",
            marginTop: "30px",
          }}
        >
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
            style={{ marginTop: "50px", paddingBottom: "50px" }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default PaginationHandler;
