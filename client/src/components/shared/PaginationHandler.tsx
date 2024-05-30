import { Col, Empty, Pagination, PaginationProps, Row, Skeleton } from "antd";
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
  children: any;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean | undefined>();
  const fetchDataWithPagination = useCallback(
    async (page: number) => {
      setLoading(true);
      const meta = await fetchData(page);
      if (meta?.total && meta.total > 0) setIsEmpty(false);
      else setIsEmpty(true);
      setTotal(meta?.total ?? 0);
      setPageSize(meta?.pageSize ?? 0);
      setCurrent(page);
      setLoading(false);
    },
    [fetchData]
  );
  useEffect(() => {
    const updatePostOnChange = () => {
      const searchParams = new URLSearchParams(location.search);
      const pageString = searchParams.get("page");
      const page = pageString ? parseInt(pageString, 10) : 1;
      fetchDataWithPagination(page);
    };
    updatePostOnChange();
  }, [location.search, fetchDataWithPagination]);
  const onChange: PaginationProps["onChange"] = async (pageNumber) => {
    console.log("Page: ", pageNumber);
    if (module) navigate(`/${module}?page=${pageNumber}`);
    else navigate(`?page=${pageNumber}`);
    // window.location.href = `localhost:3000/${type}?page=${pageNumber}`;
    fetchDataWithPagination(pageNumber);
  };
  if (isEmpty === undefined || isEmpty === false)
    return (
      <Skeleton loading={loading}>
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
      </Skeleton>
    );
  else return <Empty />;
};

export default PaginationHandler;
