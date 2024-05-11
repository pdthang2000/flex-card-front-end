import { createBrowserRouter } from 'react-router-dom';
import Home from './features/cards/components/Home';
import App from './App';
import SetHomePage from './features/sets/components/SetHomePage';
import CreateOrUpdateSet from './features/sets/components/create-set/CreateOrUpdateSet';
import React from 'react';
import SetDetail from './features/sets/components/SetDetail';
import { SetActions } from './enums';
import { RouterActions, RouterNames } from './enums/router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: RouterNames.HOME,
        element: <Home />,
      },
      {
        path: RouterNames.SETS,
        children: [
          {
            path: '',
            element: <SetHomePage />,
          },
          {
            path: RouterActions.CREATE,
            element: <CreateOrUpdateSet type={SetActions.CREATE} />,
          },
          {
            path: ':setId',
            element: <SetDetail />,
          },
          {
            path: `:setId/${RouterActions.EDIT}`,
            element: <CreateOrUpdateSet type={SetActions.UPDATE} />,
          },
        ],
      },
    ],
  },
]);
