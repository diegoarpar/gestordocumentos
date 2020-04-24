import React,{ useState,useEffect } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SHA256 from 'js-sha256'

import Slide from '@material-ui/core/Slide';



function LoginForm(props) {
  const onClickProps= props.onClick;
  const onClick= function o (event){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userLogin)
    };
    fetch('http://authenticationgestor:5000/authentication/validateuser/', requestOptions)
        .then(response => response.json())
        .then(data => {setPost(data); onClickProps(data);});
        
    
  };
  const [userLogin,setUserLogin]=useState({});
  const [data,setPost]=useState({});
    return (
        <form className="LoginForm" >
          
          <TextField name ="Tuser" label="Usuario" onChange={(e)=>{setUserLogin({user:e.target.value, password:userLogin.password})}}></TextField >
          <TextField name ="Tpassword" label="Contraseña" type='password' onChange={(e)=>{setUserLogin({user:userLogin.user,password:SHA256(e.target.value)})}}></TextField >
          <Button variant="contained" color="primary" 
              onClick={(e) => {onClick(e)}}>Ingresar al sistema
              </Button>
        </form>
    );
  }

  const Transition = React.forwardRef(function Transition(props, ref) {
    
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