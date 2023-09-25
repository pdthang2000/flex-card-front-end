import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadingCardList } from '../reducer';
import { useLocation, useParams } from 'react-router-dom';

export const SearchBar = () => {
  const dispatch = useDispatch();
  const { page: paramPage } = useParams(); // destructured directly
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const page = paramPage || queryParams.get('page') || '1';
    if (!queryParams.has('page')) {
      queryParams.set('page', page);
    }

    dispatch(
      loadingCardList({
        ...Array.from(queryParams.entries()).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {},
        ),
        page: page,
      }),
    );
  }, [dispatch, paramPage, location.search]);

  return (
    <div className={'h-10 bg-black border-0 rounded-full my-auto'}>
      <h3
        className={'text-white my-auto h-full flex items-center ml-3 text-xl'}
      >
        SearchBar
      </h3>
    </div>
  );
};
