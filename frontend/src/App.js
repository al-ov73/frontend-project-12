import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import React, { useState } from 'react';
import IndexPage from './Components/IndexPage';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import Error404Page from './Components/Error404Page';
import { AuthContext, ModalContext } from './contexts/index.jsx';
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

export const ModalProvider = ({ children }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <ModalContext.Provider value={[showAddModal, setShowAddModal]}>
      {children}
    </ModalContext.Provider>
  )
}

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

function App() {
  return (
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
  );
}

export default App;
