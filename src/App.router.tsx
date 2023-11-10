import { createBrowserRouter } from 'react-router-dom';
import Home from './features/main-page/components/Home';
import App from './App';
import SetHomePage from './features/sets/components/SetHomePage';
import CreateOrUpdateSet from './features/sets/components/create-set/CreateOrUpdateSet';
import React from 'react';
import SetDetail from './features/sets/components/SetDetail';
import { SetActions } from './enums';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/sets',
        children: [
          {
            path: '',
            element: <SetHomePage />,
          },
          {
            path: 'create',
            element: <CreateOrUpdateSet type={SetActions.CREATE} />,
          },
          {
            path: ':setId',
            element: <SetDetail />,
          },
          {
            path: ':setId/edit',
            element: <CreateOrUpdateSet type={SetActions.UPDATE} />,
          },
        ],
      },
    ],
  },
]);
