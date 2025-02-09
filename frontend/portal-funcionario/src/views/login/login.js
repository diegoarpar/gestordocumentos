import React,{ useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import Password from "@material-ui/icons/VpnKey";
import ArrowBack from '@material-ui/icons/ArrowBack';

import SHA256 from 'js-sha256';

import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";

import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";


import Slide from '@material-ui/core/Slide';
import UsersServices from '../../services/userServices'

const useStyles = makeStyles(styles);



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
                  <CardBody>
                    <CustomInput
                      labelText="Nombre de Usuario..."
                      id="first"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: (e) => {setUserLogin({user:e.target.value, password:userLogin.password})},
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }
                    }
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        onChange: (e) => {setUserLogin({user:userLogin.user,password:SHA256(e.target.value)})},
                        endAdornment: (
                          <InputAdornment position="end">
                            <Password className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button  color="primary"  onClick={(e) => {onClick(e)}}>
                      Iniciar Sesión
                    </Button>
                  </CardFooter>
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