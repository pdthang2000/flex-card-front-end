import {createBrowserRouter} from "react-router-dom";
import Home from "./features/main-page/components/Home";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      }
    ]
  },
]);