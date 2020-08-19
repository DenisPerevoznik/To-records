import React, { useEffect } from 'react';
import {useRoutes} from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth.hook';
import  {NavBar}  from './components/NavBar';
import {ToastProvider} from 'react-toast-notifications';
import { useHttp } from './hooks/http.hook';

function App() {

  const {login, logout, token, userId} = useAuth();
  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated);

  const setTheme = (theme) => {
    document.body.style.backgroundImage = 
      theme === "none" ? "none" : `url(${require(`./resources/images/themes/${theme}`)})`;
  }

  return (
    <div className="container">
      <ToastProvider>
        <AuthContext.Provider value={{login, logout, token, userId, isAuthenticated}}>
          <BrowserRouter>
            {isAuthenticated && <NavBar setTheme={setTheme}/>}
            {routes}
          
          </BrowserRouter>
        </AuthContext.Provider>
      </ToastProvider>
    </div>
);
}

export default App;
