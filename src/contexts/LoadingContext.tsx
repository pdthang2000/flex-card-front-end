import React, { createContext, useContext, useState } from 'react';
import { Modal, Spin } from 'antd';

interface ILoadingContext {
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<ILoadingContext>({
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider
      value={{
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {loading && (
        <Modal
          open
          mask
          footer={[]}
          width={'100%'}
          closeIcon={false}
          className={'w-full h-screen loading-modal border-none japan-red-dot'}
        >
          <Spin size={'large'} />
        </Modal>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
