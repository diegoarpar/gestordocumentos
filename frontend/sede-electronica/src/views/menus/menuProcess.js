import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ProcessServies from '../../services/processServices';
import UserServices from '../../services/userServices';
import ProcessForm from './processForm';
import ProcessRolesServies from '../../services/processRolesServices';
import SessionCookies from '../../utils/session';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/MoreVert';
import SessionCookie from '../../utils/session';
import ChangePassword from '../user/changePassword';
import UserManager from '../user/userManager';
import Sidebar from "react-sidebar";


function CustomizedMenus(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);
    const [rows2, setRows2] = useState([]);
    const [rowOpen, setRowOpen] = useState();
    const [open, setOpen] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [processName, setProcessName] = useState();
    const [workflowName, setWorkflowName] = useState();
    const [requestNumberPattern, setRequestNumberPattern] = useState();
    const handleContTramites=props.handleContTramites;
    const contTramites=props.contTramites;
    const [sessionUser, setSessionUser] = useState(SessionCookie.GetSessionCookie());
    
    const [sidebarOpen,setSidebarOpen]=useState(false);
    const onSetSidebarOpen=(open)=>{setSidebarOpen(false);};
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      
      handleContTramites();
    };
    const handleClickMenu=(data)=>{
      setOpen(true);
      setProcessName(data.name);
      setWorkflowName(data.workflowName);
      setRequestNumberPattern(data.requestNumberPattern);

      
    }
    useEffect(()=>{
      setSessionUser(SessionCookie.GetSessionCookie());
      var user = SessionCookie.GetSessionCookie();
      ProcessServies.GetProcessesAnonymous({"isSedeElectronicaRequest":"S","isAnonymouseRequest":"S"}).then((data)=>{
        setRows(data);
      });
      if(!!user){
        UserServices.GetRolesProcess({"user":SessionCookies.GetSessionCookie().authenticated_userid}).then((data)=>{
          var temp=[];
          data.map((row)=>{
            temp.push(row.roleName);
          });
         
          ProcessRolesServies.GetProcessesRoles({"initProcess":"S","roleName":{$in:temp}}).then((data)=>{
            var temp2=[];
            data.map((row)=>{
                temp2.push(row.process);
            });
            ProcessServies.GetProcesses({"isSedeElectronicaRequest":"S","isAnonymouseRequest":"N","name":{"$in":temp2}}).then((data)=>{
              setRows2(data);
            });
            
          });
            

        });
      }
    },[contTramites]);
  
    

    
    const handleCloseModal = () => {
      setOpen(false);
      
    };

    const ITEM_HEIGHT = 48;
    const classes=useStyles();
    return (
      <div>
      <div>
       
        <IconButton edge="start"  color="inherit" aria-label="menu"
         className={classes.buttonSidebar}
         aria-label="more"
         aria-controls="long-menu"
         aria-haspopup="true"
          onClick={(e)=>{handleClick(e); setSidebarOpen(true);}}
        >
            <MenuIcon/>
        </IconButton>
        
        <Dialog fullScreen open={open}  >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Registrar trámite
              </Typography>
            </Toolbar>
          </AppBar>
          <ProcessForm processName={processName}
                       open={open}
                       workflowName={workflowName}
                       setRowOpen={setRowOpen}
                       handleCloseModal={handleCloseModal}
                       requestNumberPattern={requestNumberPattern}
          >

          </ProcessForm>
          </Dialog>
          
      </div>


      
        <div >
        <Sidebar rootClassName={classes.root}
              overlayClassName={classes.overlay}
              sidebarClassName={classes.sidebar}
              dragToggleDistance={4}
              rootClassName={classes.root}
              sidebar={ 
                <SideBarItems handleClickMenu={handleClickMenu} 
                
                rows={rows}
                rows2={rows2}
                sessionUser={sessionUser}
                />
                
                }
              open={sidebarOpen}
              onSetOpen={onSetSidebarOpen}
            >
              <div className={classes.overlay}>
                <b >Main content</b>
                <button onClick={(e) => setSidebarOpen(!sidebarOpen)}>
                  Open sidebar
                </button>
              </div>
            </Sidebar>
            </div>
        </div>
    );
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden"
    },
    sidebar: {
      zIndex: 3,
      position: "fixed !important",
      top: 0,
      bottom: 0,
      transition: "transform .3s ease-out",
      WebkitTransition: "-webkit-transform .3s ease-out",
      willChange: "transform",
      overflowY: "auto",
      height:'100%'
    },
    content: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      transition: "left .3s ease-out, right .3s ease-out"
    },
    overlay: {
      zIndex: 1,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      visibility: "hidden",
      transition: "opacity .3s ease-out, visibility .3s ease-out",
      backgroundColor: "rgba(0,0,0,.3)"
    },
    dragHandle: {
      zIndex: 0,
      position: "fixed",
      top: 0,
      bottom: 0
    },
    buttonSidebar :{
      zIndex: 1
    },
    optionSidebar :{
      zIndex: 20
    }
  }));

  
  const SideBarItems=(props)=>{
    const rows=props.rows;
    const rows2=props.rows2;
    const handleClickMenu=props.handleClickMenu;
    const classes=makeStyles();
    const sessionUser=props.sessionUser;
    return (
      <div className={classes.slidebar}>
      {rows.map((row)=>{
        return (
        <Button variant="contained" color="inherit"
            onClick={(e)=>handleClickMenu(row)}>
          {row.name}
        </Button>)
        })
      }
      {!!sessionUser&&rows2.map((row)=>{
        return (
        <Button variant="contained" color="inherit"
            onClick={(e)=>handleClickMenu(row)}>
          {row.name}
        </Button>)
        })
      }
      {!!sessionUser&&
                    <ChangePassword></ChangePassword>
                    }
        {!!sessionUser&&
          <UserManager></UserManager>
      }
      </div>
    );
  }
  export default CustomizedMenus;