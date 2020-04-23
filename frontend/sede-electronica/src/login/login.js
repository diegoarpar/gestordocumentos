import React,{ useState,useEffect } from 'react';
import '../App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

function Login(props) {
  const onClick= props.onClick;
    return (
        <div className="App">
          <label>Usuario: </label>
          <Input></Input>
          <label>Contraseña: </label>
          <Input type='password'></Input>
          <Button variant="contained" color="primary" onClick={onClick}>Ingresar al sistema</Button>
        </div>
    );
  }

export default Login;