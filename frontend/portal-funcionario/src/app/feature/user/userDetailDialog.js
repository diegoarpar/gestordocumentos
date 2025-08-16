import React,{ useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import CustomInput from "@/app/components/CustomInput/CustomInput.js";
import InputAdornment from "@mui/material/InputAdornment";
import Password from "@mui/icons-material/VpnKey";
import People from "@mui/icons-material/People";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
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