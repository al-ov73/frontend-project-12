import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IndexPage from './Components/IndexPage';
import LoginPage from './Components/LoginPage';
import Error404Page from './Components/Error404Page';
import { actions as usersActions } from './slices/usersSlice.js';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

function App() {
  const dispatch = useDispatch();

  return (
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="*" element={<Error404Page />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
            <PrivateRoute>
              <IndexPage />
            </PrivateRoute>
            )}
          />
        </Routes>
      </Router>
  </AuthProvider>
  );
}

export default App;
