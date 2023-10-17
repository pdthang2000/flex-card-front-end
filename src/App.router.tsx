import { createBrowserRouter } from 'react-router-dom';
import Home from './features/main-page/components/Home';
import App from './App';
import SetHomePage from './features/sets/components/SetHomePage';
import CreateSet from './features/sets/components/create-set/CreateSet';
import React from 'react';
import SetDetail from './features/sets/components/SetDetail';

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
            element: <CreateSet />,
          },
          {
            path: ':id',
            element: <SetDetail />,
          },
        ],
      },
    ],
  },
]);
