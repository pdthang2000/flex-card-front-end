import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadingCardList } from '../reducer';

export const SearchBar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      loadingCardList({
        take: 100,
      }),
    );
  }, [dispatch]);

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
