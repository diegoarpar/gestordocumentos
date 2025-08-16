import React,{ useState,useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from "@mui/material/InputAdornment";
import ListItemText from "@mui/material/ListItemText";


import Icon from "@mui/material/Icon";

import People from "@mui/icons-material/People";
import Password from "@mui/icons-material/VpnKey";
import ArrowBack from '@mui/icons-material/ArrowBack';

import SHA256 from "crypto-js/sha256";

import { styled }  from "@mui/material/styles";
import styles from "../../src/assets/jss/material-kit-react/views/loginPage.js";

import CardHeader from "@/app/components/Card/CardHeader.js";
import CardFooter from "@/app/components/Card/CardFooter.js";
import CustomInput from "@/app/components/CustomInput/CustomInput.js";
import CardBody from "@/app/components/Card/CardBody.js";

import Slide from '@mui/material/Slide';
import UsersServices from '@/app/api/userServices';

const useStyles = styled(styles);


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
    
    const [open, setOpen] = useState(false);
  
    function handleChangePassword (row){
      UsersServices.ChangePassword(
        {
      "currentpassword":row.currentPassword,
      "newpassword":row.newPassword,
      "user":'sessionUser.authenticated_userid'
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
        {open&&<Dialog fullScreen open={open}  >
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