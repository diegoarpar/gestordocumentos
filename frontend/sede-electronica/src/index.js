import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

debugger;
const node1 = document.createElement('div'); 
node1.id="another-root1"; 
document.body.appendChild(node1);
const portalContainer1 = document.getElementById('another-root1');

const node2 = document.createElement('div'); 
node2.id="another-root2"; 
document.body.appendChild(node2);
const portalContainer2 = document.getElementById('another-root2');

ReactDOM.render(
  
    <App mc={document.getElementById('root')} 
         pc1={portalContainer1} 
         pc2={portalContainer2} 
    />,
  
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
