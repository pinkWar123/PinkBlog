import { useCallback, useEffect, useState } from "react";
import { ISeries } from "../../types/backend";
import { useLocation, useNavigate } from "react-router-dom";
import { useUrlParams } from "../../hooks/useUrlParams";
import { fetchSeriesWithPagination } from "../../services/seriesApi";
import PaginationHandler from "../../components/shared/PaginationHandler";
import { PostItem } from "../../components/shared";

const Series: React.FC = () => {
  const [series, setSeries] = useState<ISeries[] | undefined>();
  const navigate = useNavigate();
  const fetchSeries = useCallback(async (id: string, current: number) => {
    const res = await fetchSeriesWithPagination(current, 5, `createdBy=${id}`);
    console.log(res);
    if (res && res.status === 200) {
      setSeries(res.data.data?.result);
    }
    return res?.data?.data?.meta;
  }, []);
  const { id } = useUrlParams({ fetchData: fetchSeries });
  const fetchData = useCallback(
    async (page: number) => {
      return fetchSeries(id ?? "", page);
    },
    [fetchSeries, id]
  );
  return (
    <>
      <PaginationHandler fetchData={fetchData}>
        <>
          {series?.map((serie) => (
            <PostItem
              title={serie.title}
              createdBy={serie.createdBy}
              createdAt={serie.createdAt}
              tags={serie.tags}
              viewCount={serie.viewCount}
              onClick={() => navigate(`/series/${serie._id}`)}
            />
          ))}
        </>
      </PaginationHandler>
    </>
  );
};

export default Series;
