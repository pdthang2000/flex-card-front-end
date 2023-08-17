import React from 'react';
import './App.css';
import {Outlet, useNavigate} from "react-router-dom";
import {Menu, MenuProps} from "antd";

const items: MenuProps['items'] = [
  {
    label: <div className={'text-white'}>Home</div>,
    key: 'home',
  },
  {
    label: <div className={'text-white'}>Sets</div>,
    key: 'sets',
  },
  {
    label: <div className={'text-white'}>Navigation Three</div>,
    key: 'map',
  },
];

function App() {
  const navigate = useNavigate();
  const clickMenu = (e: any) => {
    navigate(e.key);
  };

  return (
      <div className={'bg-black min-h-screen'}>
        <div className={'w-4/5 mx-auto bg-violet-950 h-fit min-h-screen'}>
          <Menu
            className={'pl-7 pt-5 w-full bg-violet-950 text-xl'}
            onClick={clickMenu}
            items={items}
            mode={'horizontal'}
          />
          <Outlet/>
        </div>
      </div>
  );
}

export default App;
