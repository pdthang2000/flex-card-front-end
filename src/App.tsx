import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";

function App() {
  return (
      <div className={'bg-black min-h-screen'}>
        <div className={'w-4/5 mx-auto bg-violet-950 h-fit min-h-screen'}>
          <Outlet/>
        </div>
      </div>
  );
}

export default App;
