import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IndexPage from './Components/IndexPage';
import LoginPage from './Components/LoginPage';
import Error404Page from './Components/Error404Page';
import { actions as usersActions } from './slices/usersSlice.js';

function App() {
  const dispatch = useDispatch();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error404Page />} />
        <Route path="/" element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
