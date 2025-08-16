import React,{ useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import UserInformation from './userInformation';
import UserServices from '@/app/api/userServices';
import SedeElectronciaGeneralServices from '@/app/api/sedeElectronicaGeneralServices';
import SHA256 from "crypto-js/sha256";

const UserManager=(props)=>{
  const [open, setOpen]= useState(false);
  const [user, setUser]= useState({});
  const [modalType, setModalType]= useState();
  const contTramites = props.contTramites;
  const [enrollingType, setEnrollingType]= useState("none");
  const [userEnrollingVisibility, setUserEnrollingVisibility]= useState(false);
  const handleCloseModal = ()=>{
    setOpen(false);
    
  }
  const handleOpenModal = (modalType)=>{
    if(modalType=="M"){
      var currentUser = 'GetSessionCookie().authenticated_userid';
      UserServices.GetData({"userName":'currentUser'})
      .then((data)=>{
        if(!!data&&data.length>0){
          setUser(data[0]);
          setModalType(modalType);
          setOpen(true);
        }
        
      });
    }else{
      setOpen(true);
      setUser({});
      setModalType(modalType);
    }
  }
  useEffect(()=>{
    setCurrentUser(GetSessionCookie());
    setUserEnrollingVisibility(false);
    SedeElectronciaGeneralServices.GetSedeElectronicaGeneral({"type":"EXTERNAL_REGISTRY","type2":"visibilityVentanilla","value":"VS"})
    .then((data)=>{
        if(!!data&&data.length>0){
         setUserEnrollingVisibility(true);
        }
    });
    SedeElectronciaGeneralServices.GetSedeElectronicaGeneral({"type":"EXTERNAL_REGISTRY","type2":"enroll"})
    .then((data)=>{
        if(!!data&&data.length>0){
         setEnrollingType(data[0].value);
        }
    });

  },[contTramites]);
  const handleClickSaveModal=(e,data)=>{
    if(modalType=="C"){
      delete data._id;
      data.active="N";
      data.password=SHA256(data.password);
      data.enrollingType=enrollingType;
      UserServices.CreateUser(data);
    }else if (modalType=="M"){
      delete data.password;
      delete data._id;
      UserServices.UpdateUser({"userQuery":{"user":GetSessionCookie().authenticated_userid},"userNewData":data});
    }
    
  }

  return (
  <div>
      {userEnrollingVisibility&&<Button 
      variant="contained"
      aria-controls="customized-menu"
      aria-haspopup="true"
      onClick={(e)=>handleOpenModal("C")}>
          Registrar Ciudadano
        </Button>
        }
      <Dialog fullScreen open={open}  >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                {modalType=="M"?"Actualizar Datos":"Registrar Ciudadano"}
              </Typography>
            </Toolbar>
          </AppBar>
          <UserInformation handleClick={handleClickSaveModal} 
            onClose ={handleCloseModal} 
            rowInformation={user} 
            modalType={modalType}
          ></UserInformation>  
        </Dialog>
  </div>);
}

export default UserManager;