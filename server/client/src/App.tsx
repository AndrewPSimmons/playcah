import React from 'react';
import { userNewId } from './redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import routes from './router';
function App() {
  const store = useSelector(state=>state)
  return (
    <Router>
      {/*JSON.stringify(store)*/}
        <Routes>
          {routes.map(route => {
            return <Route key={route.path} path={route.path} element={<route.component />} />
          })}
        </Routes>
    </Router>
  );
}

export default App;
