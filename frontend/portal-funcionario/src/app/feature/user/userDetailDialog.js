import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Password from "@material-ui/icons/VpnKey";
import People from "@material-ui/icons/People";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";
import UserInformation from "./userInformation";

const UserDetailDialog=(props)=>{
  const rowInformation = props.row;
  const [open, setOpen] = useState(false);
  return (
          <div>


              {<Button
                  variant="contained"
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  onClick={(e)=>setOpen(true)}>
                  Ver detalle
              </Button>
              }
              <Dialog fullScreen open={open}  >
                  <AppBar position="sticky">
                      <Toolbar>
                          <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
                              <ArrowBack />
                          </IconButton>
                          <Typography variant="h6" >
                              Detalle del ciudadano
                          </Typography>
                      </Toolbar>
                  </AppBar>
                  <UserInformation rowInformation = {rowInformation} modalType="R"/>
              </Dialog>
          </div>
          

  );
}


export default UserDetailDialog;