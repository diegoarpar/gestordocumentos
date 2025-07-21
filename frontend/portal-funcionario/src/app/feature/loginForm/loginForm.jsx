'use client'
import React,{ useState } from 'react';

import Link from "next/link.js";
import UsersServices from '../../api/userServices'

function LoginForm(props) {
  const onClickProps= props.onClick;
  
  const onClick= function o (event){
    UsersServices.LogIn(userLogin )
        .then(data => {setPost(data); onClickProps(data);});
        
    
  };

  const [userLogin,setUserLogin]=useState({});
  const [data,setPost]=useState({});
  const classes = useStyles();
    return (
        <form className="LoginForm" >

                  <p className={classes.divider}>Ingrese su información</p>
                  <div>
                    <input
                      labelText="Nombre de Usuario..."
                      id="first"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: (e) => {setUserLogin({user:e.target.value, password:userLogin.password})},
                      }
                    }
                    />
                    <input
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        onChange: (e) => {setUserLogin({user:userLogin.user,password:e.target.value})},
                        endAdornment: (
                          <input position="end">
                            <Password className={classes.inputIconsColor} />
                          </input>
                        ),
                        autoComplete: "off"
                      }}
                    />
                  </div>
                  <div className={classes.cardFooter}>
                    <button  color="primary"  onClick={(e) => {onClick(e)}}>
                      Iniciar Sesión
                    </button>
                  </div>
        </form>
    );
  }


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
        <button variant="outlined" color="primary" onClick={handleClickOpen}>
          Iniciar sesión
        </button>
        <Dialog fullScreen open={open} onClose={handleClose} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Inicar Sesión
              </Typography>
            </Toolbar>
          </AppBar>
          <LoginForm  onClick={onClick}></LoginForm>  
        </Dialog>
        
      </div>
    );
  }
  

export default Login;