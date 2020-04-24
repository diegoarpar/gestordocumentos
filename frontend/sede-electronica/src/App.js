import React,{ useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Login from './login/login'
import Files from './files/files'

function App(props) {
  const [mainContainer, setMainContainer] = useState(props.mc);
  const [portalContainer1, setPortalContainer1] = useState(props.pc1);
  const [portalContainer2, setPortalContainer2] = useState(props.pc2);
  const [data, setPostRId] = useState({id:""});
  const [token, setToken] = useState({});

  function login(t){
    setToken(t);
    console.log(t);
    
    
  }
  function findDocument(){

    alert("Gracias por buscar el documento");
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
          <LoginApp portalContainer={portalContainer1} onClick={login}/>
      </div>
      <div>
          <FindFileApp portalContainer={portalContainer1} onClick={findDocument}/>
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
