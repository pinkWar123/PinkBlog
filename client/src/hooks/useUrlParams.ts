import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export const useUrlParams = ({
  fetchData,
}: {
  fetchData: (
    id: string,
    current: number,
    pageSize?: number,
    qs?: string
  ) => Promise<any>;
}) => {
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  useEffect(() => {
    console.log(id);
    if (!id) return;
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    fetchData(id, page);
  }, [location.search, fetchData, id]);
  return { id };
};
