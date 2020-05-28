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
import ListItemText from "@material-ui/core/ListItemText";


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


function ChangePasswordForm(props) {
  const onClickProps= props.onClick;
  
  const onClick= function o (event){
    onClickProps({"newPassword":SHA256(newPassword),"currentPassword":SHA256(currentPassword)});
  };

  const [currentPassword,setCurrentPassword]=useState();
  const [newPasswordConfirmation,setNewPasswordConfirmation]=useState();
  const [enabled,setEnabled]=useState(false);
  const [newPassword,setNewPassword]=useState();
  const handleNewPasswordConfirmation=(value)=>{
    setEnabled(false);
    if(newPassword==value){
      setEnabled(true);
    }
  }
  const handlePasswordConfirmation=(value)=>{
    setEnabled(false);
    if(value==newPasswordConfirmation){
      setEnabled(true);
    }
  }
  const classes = useStyles();
    return (
        <form className="LoginForm" >

                  <p className={classes.divider}>Ingrese su información</p>
                  <CardBody>
                    <CustomInput
                      labelText="Contraseña actual..."
                      id="currentPassword"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        onChange: (e) => {setCurrentPassword(e.target.value)},
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }
                    }
                    />
                    <CustomInput
                      labelText="Nueva contraseña..."
                      id="newPassword"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        onChange: (e) => {setNewPassword(e.target.value); handlePasswordConfirmation(e.target.value);},
                        endAdornment: (
                          <InputAdornment position="end">
                            <Password className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                    />
                    <CustomInput
                      labelText="Confirme nueva contraseña..."
                      id="newPasswordConfirmation"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        onChange: (e) => {setNewPasswordConfirmation(e.target.value);handleNewPasswordConfirmation(e.target.value);},
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
                    {enabled&&<Button   color="primary"  onClick={(e) => {onClick(e)}}>
                      Cambiar contraseña
                    </Button>
                  }
                  </CardFooter>
        </form>
    );
  }

  

  function ChangePassword(props) {
    const [token, setToken] = useState({});
    const [sessionUser, setSessionUser] = useState(SessionCookie.GetSessionCookie());
    const [open, setOpen] = useState(false);
  
    function handleChangePassword (row){
      UsersServices.ChangePassword(
        {
      "currentpassword":row.currentPassword,
      "newpassword":row.newPassword,
      "user":sessionUser.authenticated_userid
      })
      .then((data)=>{
          if(!!data){
            if(data.flag==true){
              setOpen(false);
            }
          }
      });
    }
  
    return (
      <div>
        {!!sessionUser&&<Button variant="contained" color="inherit"
             onClick={(e)=>{setOpen(true)}}> Cambiar Contraseña
             </Button>
          
        }
        {open&&<Dialog fullScreen open={open} onClose={(e)=>setOpen(false)} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={(e)=>setOpen(false)} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Cambiar Contraseña
              </Typography>
            </Toolbar>
          </AppBar>
          <ChangePasswordForm  onClick={handleChangePassword}></ChangePasswordForm>  
        </Dialog>
        }
      </div>
    );
  }
  

export default ChangePassword;