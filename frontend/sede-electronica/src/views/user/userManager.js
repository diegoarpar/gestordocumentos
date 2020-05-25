import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import UserInformation from './userInformation';
import UserServices from '../../services/userServices';
import SessionCookie from '../../utils/session';
import SedeElectronciaGeneralServices from '../../services/sedeElectronicaGeneralServices';
import SHA256 from 'js-sha256';

const UserManager=(props)=>{
  const [open, setOpen]= useState(false);
  const [user, setUser]= useState({});
  const [userEnrollingVisibility, setUserEnrollingVisibility]= useState(false);
  const [enrollingType, setEnrollingType]= useState("none");
  const [currentUser, setCurrentUser]= useState(SessionCookie.GetSessionCookie());
  const [modalType, setModalType]= useState();
  const contTramites = props.contTramites;
  const handleCloseModal = ()=>{
    setOpen(false);
    
  }
  const handleOpenModal = (modalType)=>{
    if(modalType=="M"){
      var currentUser =SessionCookie.GetSessionCookie().authenticated_userid;
      UserServices.GetData({"userName":currentUser})
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
    setCurrentUser(SessionCookie.GetSessionCookie());
    setUserEnrollingVisibility(false);
    SedeElectronciaGeneralServices.GetSedeElectronicaGeneral({"type":"EXTERNAL_REGISTRY","type2":"visibilitySede","value":"SS"})
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
      UserServices.UpdateUser({"userQuery":{"user":SessionCookie.GetSessionCookie().authenticated_userid},"userNewData":data});
    }
    
  }

  return (
  <div>
      {!!!currentUser&&userEnrollingVisibility&&<Button variant="outlined" color="inherit" onClick={(e)=>handleOpenModal("C")}>
          Registrarme
        </Button>
        }
        {!!currentUser&&<Button variant="outlined" color="inherit" onClick={(e)=>handleOpenModal("M")}>
          Actualizar Datos
        </Button>
        }
      <Dialog fullScreen open={open} onClose={handleCloseModal} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                {modalType=="M"?"Actualizar Datos":"Registrar Usuario"}
              </Typography>
            </Toolbar>
          </AppBar>
          <UserInformation 
            handleClick={handleClickSaveModal} 
            onClose ={handleCloseModal} 
            rowInformation={user} 
            modalType={modalType}
            enrollingType={enrollingType}
            ></UserInformation>  
        </Dialog>
  </div>);
}

export default UserManager;