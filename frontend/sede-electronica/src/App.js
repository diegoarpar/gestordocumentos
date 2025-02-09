import React,{ useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Login from './views/login/login.js';
import SessionCookie from './utils/session';
import Files from './views/files/files.js';
import LandingPage from './views/landingPage/landingPage.js';
import Footer from "components/Footer/Footer.js";
import {  Switch, Route,Redirect,Link   } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom"
import { createBrowserHistory } from "history";
import Button from '@material-ui/core/Button';
import MenuProcess from 'views/menus/menuProcess';
import './App.scss';

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
          <Route path="/userAdministration">
           
             
          </Route> 
          <Route path="*"  />
        </Switch>
        </Router>
      </SessionContext.Provider>
  );
};
function App(props) {
  
  const [mainContainer, setMainContainer] = useState(props.mc);
  const [portalContainer1, setPortalContainer1] = useState(props.pc1);
  const [portalContainer2, setPortalContainer2] = useState(props.pc2);
  
  

  function findDocument(){

    alert("Gracias por buscar el documento");
  }
  

  
  
  return (
    <div className="App">
      <div>
          <FindFileApp portalContainer={portalContainer1} onClick={findDocument}/>
      </div>
      <Routes historyp={history}/>
      
    
      <div className="fixLogin">
          <LandingPage ></LandingPage>
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
function FindFileApp(props){
  const portalContainer = props.portalContainer;
  const onClickDocument = props.onClick;
    return ReactDOM.createPortal(<Files
      pc={portalContainer} onClick={onClickDocument} />, portalContainer);
}




export default App;
