import { Menu, MenuProps } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    label: (
      <Link to={'/home'} className={'text-white-i'}>
        Home
      </Link>
    ),
    key: 'home',
  },
  {
    label: (
      <Link to={'/sets'} className={'text-white-i'}>
        Sets
      </Link>
    ),
    key: 'sets',
  },
  {
    label: (
      <Link to={'/sets/create'} className={'text-white-i'}>
        Create
      </Link>
    ),
    key: 'sets/create',
  },
];

const NavBar = () => {
  return (
    <Menu
      className={'pl-7 pt-2 w-full bg-[#0A092D] text-md'}
      items={items}
      mode={'horizontal'}
    />
  );
};

export default NavBar;
