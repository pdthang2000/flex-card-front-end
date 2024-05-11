import React from 'react';
import './App.css';
import { Outlet, useNavigate, NavigateFunction } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Divider } from 'antd';
import { LoadingProvider } from './contexts/LoadingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
export let globalNavigate: NavigateFunction;

export const GlobalHistory = () => {
  globalNavigate = useNavigate();

  return null;
};

function App() {
  return (
    <div className={'bg-main min-h-screen'}>
      <GlobalHistory />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={'w-4/5 mx-auto h-fit min-h-screen'}>
        <NavBar />
        <Divider className={'ml-10 bg-sub-main m-0'} />
        <LoadingProvider>
          <Outlet />
        </LoadingProvider>
      </div>
    </div>
  );
}

export default App;
