import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Divider } from 'antd';
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <div className={'bg-main min-h-screen'}>
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
