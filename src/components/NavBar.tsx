import { Menu, MenuProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    label: <div className={'text-white'}>Create</div>,
    key: 'sets/create',
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const clickMenu = (e: any) => {
    navigate(e.key);
  };

  return (
    <Menu
      className={'pl-7 pt-2 w-full bg-[#0A092D] text-md'}
      onClick={clickMenu}
      items={items}
      mode={'horizontal'}
    />
  );
};

export default NavBar;
