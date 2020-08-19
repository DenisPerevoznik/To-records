import React, { useEffect } from 'react';
import {useRoutes} from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth.hook';
import  {NavBar}  from './components/NavBar';
import {ToastProvider} from 'react-toast-notifications';
import Helement from 'react-helmet';

function App() {

  
  const {login, logout, token, userId} = useAuth();
  const isAuthenticated = !!token;
  
  const routes = useRoutes(isAuthenticated);

    useEffect(() => {
      if(!isAuthenticated)
        document.body.style.backgroundImage = "none";
  
    }, [isAuthenticated]);

  const setTheme = (theme) => {
    document.body.style.backgroundImage = 
      theme === "none" ? "none" : `url(${require(`./resources/images/themes/${theme}`)})`;
  }

  return (
    <div className="container">
      <Helement>
        <title>To Records</title>
      </Helement>
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
