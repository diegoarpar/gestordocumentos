import React,{ useState,useEffect } from 'react';
import '../App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Slide from '@material-ui/core/Slide';



function LoginForm(props) {
  const onClick= props.onClick;
    return (
        <div className="LoginForm">
          <label>Usuario: </label>
          <Input></Input>
          <label>Contraseña: </label>
          <Input type='password'></Input>
          <Button variant="contained" color="primary" onClick={onClick}>Ingresar al sistema</Button>
        </div>
    );
  }

  const Transition = React.forwardRef(function Transition(props, ref) {
    debugger;
    return <Slide direction="up" ref={ref} {...props} />;
  });

  function Login(props) {
    const onClick= props.onClick;
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Iniciar sesión
        </Button>
        <Dialog fullScreen open={open} onClose={handleClose} >
          <AppBar >
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                
              </IconButton>
              <Typography variant="h6" >
                Inicar sesión
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Cerrar
              </Button>
            </Toolbar>
          </AppBar>
         
          <LoginForm  onClick={onClick}></LoginForm>
          
        </Dialog>
      </div>
    );
  }
  

export default Login;