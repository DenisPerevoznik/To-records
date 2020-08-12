import React from 'react';
import {useRoutes} from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth.hook';
import  {NavBar}  from './components/NavBar';
import {ToastProvider} from 'react-toast-notifications';

function App() {

  const {login, logout, token, userId} = useAuth();
  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated);
  return (
    <div className="container">
      <ToastProvider>
        <AuthContext.Provider value={{login, logout, token, userId, isAuthenticated}}>
          <BrowserRouter>
            {isAuthenticated && <NavBar/>}
            {routes}
          
          </BrowserRouter>
        </AuthContext.Provider>
      </ToastProvider>
    </div>
);
}

export default App;
