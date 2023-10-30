import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadingCardList } from '../reducer';
import { useLocation, useParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

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
    <div className={'h-full w-full rounded-b-md'}>
      <input
        size={100}
        placeholder={`Input set's title ...`}
        className={'custom-search'}
      />
      <SearchOutlined
        className={'text-gray-400 absolute text-xl right-3 top-2 '}
      />
    </div>
  );
};
