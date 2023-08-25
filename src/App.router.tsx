import { createBrowserRouter } from 'react-router-dom';
import Home from './features/main-page/components/Home';
import App from './App';
import SetHomePage from './features/sets/components/SetHomePage';
import CreateSet from './features/sets/components/create-set/CreateSet';

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
        ],
      },
    ],
  },
]);
