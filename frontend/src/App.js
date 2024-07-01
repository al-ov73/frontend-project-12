import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import IndexPage from './Components/IndexPage';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import Error404Page from './Components/Error404Page';
import { AuthContext, ModalContext } from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { setCredentials } from './slices/usersSlice.js';

const rollbarConfig = {
  accessToken: 'c281d54b8bd04499be6c36258414da01',
  environment: 'production',
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ModalProvider = ({ children }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDelChannelModal, setShowDelChannelModal] = useState(false);
  return (
    <ModalContext.Provider value={[showAddModal, setShowAddModal, showDelChannelModal, setShowDelChannelModal]}>
      {children}
    </ModalContext.Provider>
  )
}

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  if (localStorage.getItem('user')) {
    const { token, username } = JSON.parse(localStorage.getItem('user'));
    auth.loggedIn = true;
    dispatch(setCredentials({ token, username }));
  };
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <ModalProvider>
            <Router>
              <Routes>
                <Route path="*" element={<Error404Page />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
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
          </ModalProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
