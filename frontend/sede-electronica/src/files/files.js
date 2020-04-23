import React,{ useState,useEffect } from 'react';
import '../App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

function Files(props) {
    const onClick= props.onClick;
    return (
        <div className="App">
          <label>Cédula: </label>
          <Input></Input>
          <label>Código del documento: </label>
          <Input></Input>
          <Button variant="contained" color="primary" onClick={onClick}>Consultar documento: </Button>
        </div>
    );
  }

export default Files;