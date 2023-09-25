import { Pagination } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

interface CustomPaginationProps {
  className?: string;
  total: number;
  totalPages: number;
  pageSize: number;
  fetchDataForPage: (data: any) => any;
}

const CustomPagination = ({
  className,
  pageSize,
  total,
  fetchDataForPage,
}: CustomPaginationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    if (page && !isNaN(parseInt(page))) {
      setCurrentPage(parseInt(page));
    }
  }, [location]);

  const handlePageChange = (page: number) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', page.toString());
    navigate(`${location.pathname}?${queryParams.toString()}`);
    dispatch(fetchDataForPage({ page }));
  };

  return (
    <Pagination
      current={currentPage}
      className={`${className} custom-pagination`}
      total={total}
      pageSize={pageSize}
      onChange={handlePageChange}
    />
  );
};

export default CustomPagination;
