import {Route, Routes} from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      <Route path={'/'}/>
      <Route path={'/test'} />
    </Routes>
    )
}