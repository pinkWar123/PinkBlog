import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface PaginationPageProps<T> {
  data: T[];
  setData: React.SetStateAction<React.Dispatch<T[]>>;
  fetchData: (page: number) => Promise<void>;
}

const PaginationPage = <T,>({
  data,
  setData,
  fetchData,
}: PaginationPageProps<T>): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageString = searchParams.get("page");
    const page = pageString ? parseInt(pageString, 10) : 1;
    console.log(page);
    fetchData(page);
  }, [location.search, fetchData]);
  return <></>;
};

export default PaginationPage;
