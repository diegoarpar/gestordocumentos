import React,{ useState,useEffect }  from 'react';
import './App.css';
import './App.scss';
import Login from './views/login/login.js';
import {  Switch, Route   } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom"
import { createBrowserHistory } from "history";
import VentanillaRadicacion from './views/ventanilla/ventanilla';
import CustomizedMenus from './views/menus/menu';
import UserWaitingApproved from './views/user/userWaitingApproved';
import SessionCookie from './utils/session';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';

export const SessionContext = React.createContext(SessionCookie.GetSessionCookie());
export const history = createBrowserHistory();

const Routes = (props) => {
  const historyp=props.historyp;
  const [sessionUser, setSessionUser] = useState( SessionCookie.GetSessionCookie());

  return (
    <SessionContext.Provider value={sessionUser} >
       <Router  history={historyp} >

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/ventanillaRadicacion">
             <VentanillaRadicacion/>
          </Route>
          <Route path="/userWatingApproved">
             <UserWaitingApproved/>
          </Route>
          <Route path="*"  />
        </Switch>
        </Router>
      </SessionContext.Provider>
  );
};
function App(props) {
  //const [mainContainer, setMainContainer] = useState(props.mc);
  const [portalContainer1, setPortalContainer1] = useState(props.pc1);
  //const [portalContainer2, setPortalContainer2] = useState(props.pc2);
  const [sessionUser, setSessionUser] = useState( SessionCookie.GetSessionCookie());
  const [userInSession, setUserInSession] = useState( );
  useEffect(() => {
    if(!!sessionUser&&!!sessionUser.access_token){
    setUserInSession ({"user":sessionUser.authenticated_userid});
    }else {
      if(history.location.pathname!="/")
      logOut()
    }
    },[sessionUser]);

    function logIn (t){
    SessionCookie.SetSessionCookie(t);
    setSessionUser(t);
    console.log(t);
  }

  function logOut (){
    SessionCookie.SetSessionCookie(null);
    setSessionUser(null);
    history.push('/');
    history.go();

  }
  return (
      <div className="App">
        <div>
          {!userInSession?
            "Bienvenido al portal del funcionario ":""

          }
          <div>
          {!userInSession&&
            <LoginApp portalContainer={portalContainer1} onClick={logIn }/>
          }
          </div>
          <div>
            {!!userInSession &&
            <VentanillaRadicacion></VentanillaRadicacion>
            }
          </div>
          <Routes historyp={history}/>
        </div>

      </div>
    );
  }

  function LoginApp(props){
    const portalContainer = props.portalContainer;
    const onClickLogin = props.onClick;
      return ReactDOM.createPortal(<Login
        pc={portalContainer} onClick={onClickLogin}/>, portalContainer);
  }

export default App;
