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

  function login(){

    alert("Gracias por ingresar");
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
      { ReactDOM.createPortal(<Login  
                pc={portalContainer1} onClick={login}/>, portalContainer1) }
      { ReactDOM.createPortal(<Files  
      pc={portalContainer2} onClick={findDocument} />, portalContainer2) }
    </div>
  );
}

export default App;
