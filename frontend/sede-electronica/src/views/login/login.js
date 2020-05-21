import React,{ useState,useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import People from "@material-ui/icons/People";
import Password from "@material-ui/icons/VpnKey";
import ArrowBack from '@material-ui/icons/ArrowBack';

import SHA256 from 'js-sha256';

import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";

import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import SessionCookie from '../../utils/session';

import Slide from '@material-ui/core/Slide';
import UsersServices from '../../services/userServices';
import { createBrowserHistory } from "history";

const useStyles = makeStyles(styles);
export const history = createBrowserHistory();


function LoginForm(props) {
  const onClickProps= props.onClick;
  
  const onClick= function o (event){
    const  headers = { 'Content-Type': 'application/json' };
    UsersServices.LogIn(userLogin,headers )
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
    const [token, setToken] = useState({});
    const [sessionUser, setSessionUser] = useState(SessionCookie.GetSessionCookie());
    const [userInSession, setUserInSession] = useState( );
    const [open, setOpen] = React.useState(false);
    const handleContTramites=props.handleContTramites;
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    function logIn (t){
     
      setToken(t);
      SessionCookie.SetSessionCookie(t);
      setSessionUser(t);
      handleContTramites();
      if(!!t&&!!t.access_token){
        setOpen(false);handleContTramites();
      }      
    }
  
    function logOut (){
       
      setToken(null);
      SessionCookie.SetSessionCookie(null);
      handleContTramites();
      setSessionUser(null);
      if(window.location.pathname!="/"){
        history.push('/');
        history.go();
      }
      
    }
    useEffect(() => {
    
      if(!!sessionUser&&!!sessionUser.access_token){
      setUserInSession ({"user":sessionUser.authenticated_userid});
      }else {
        
        
        if(history.location.pathname!="/")
        logOut()
      }
      },[sessionUser]);

    return (
      <div>
          Bienvenido {!!sessionUser&&!!sessionUser.authenticated_userid?sessionUser.authenticated_userid:""}  
        {!!!sessionUser&&<Button variant="outlined" color="inherit" onClick={handleClickOpen}>
          Iniciar sesión
        </Button>
        }
        {!!sessionUser&&!!sessionUser.authenticated_userid&&<Button variant="outlined" color="inherit" onClick={logOut}>
          Salir
        </Button>
        }

        
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
          <LoginForm  onClick={logIn}></LoginForm>  
        </Dialog>
        
      </div>
    );
  }
  

export default Login;