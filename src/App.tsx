import React from 'react';
import './App.css';
import {Outlet, useNavigate} from "react-router-dom";
import {Menu, MenuProps} from "antd";

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'Sets',
    key: 'sets',
  },
  {
    label: 'Navigation Three',
    key: 'map',
  },
];

function App() {
  const navigate = useNavigate();
  const clickMenu = (e: any) => {
    console.log(e.key);
    navigate(e.key);
  };

  return (
      <div className={'bg-black min-h-screen'}>
        <div className={'w-4/5 mx-auto bg-violet-950 h-fit min-h-screen'}>
          <Menu
            className={'pl-10 pt-5 w-full bg-violet-950 text-white hover:text-white text-xl'}
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
