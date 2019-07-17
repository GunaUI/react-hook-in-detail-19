import React, { useState } from 'react';
import Todo from './components/Todo';
import Header from './components/Header';
import Auth from './components/Auth';
import AuthContext from './auth-context'

const app = props =>{

  const [page, setPage] = useState('auth');

  const [authStatus, setPageStatus] = useState(false);

  const switchPage = (PageName) => {
    setPage(PageName);
  };
  const login = () => {
    setPageStatus(true);
  };

  return(
    <div className="App">
      <AuthContext.Provider value={{status : authStatus, loginFunc : login}}>
          <Header 
          onLoadTodos={switchPage.bind(this, 'todos')} 
          onLoadAuth={switchPage.bind(this, 'auth')}
          />
          <hr/>
          {page === 'auth' ? <Auth/> : <Todo/>}
      </AuthContext.Provider>
    </div>
  );

};
  
export default app;
