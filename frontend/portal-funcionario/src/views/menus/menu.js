import React, {useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/MoreVert';
import Sidebar from "react-sidebar";
import SessionCookies from '../../utils/session';
import MenuProcess from './menuProcess';
import UserManager from "../user/userManager";
import UserFinder from "../user/userFinder";
import ChangePassword from "../user/changePassword";
import UserWaitingApproved from "../user/userWaitingApproved";
import Toolbar from "@material-ui/core/Toolbar";
import SessionCookie from "../../utils/session";
import {history} from "../../App";

function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const history= props.history;
    const [sessionUser, setSessionUser] = useState(SessionCookies.GetSessionCookie());
    const sidebarOpen =props.sidebarOpen;
    const setSidebarOpen=props.setSidebarOpen;
    const handleClickMenu =(row)=>{setSidebarOpen(false)}
    const onSetSidebarOpen =(row)=>{setSidebarOpen(false)}
    const contTramites=props.contTramites;
    const handleContTramites = props.handleContTramites;

    const rows =[
      {"name":"ventanillaRadicacion", "path":"/ventanillaRadicacion", "description":"Ventanilla de radicación"},
      {"name":"userWatingApproved", "path":"/userWatingApproved", "description":"Aprobación de usuarios"},

    ];

  
    const classes= useStyles2();
    return (
      <div>
        <Sidebar rootClassName={classes.root}
              overlayClassName={classes.overlay}
              sidebarClassName={classes.sidebar}
              dragToggleDistance={4}
              rootClassName={classes.root}
              sidebar={ 
                <SideBarItems
                handleClickMenu={handleClickMenu}
                contTramites={contTramites}
                handleContTramites={handleContTramites}
                rows={rows}
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
    );
  }
  

  const SideBarItems=(props)=>{
    const contTramites=props.contTramites;
    const handleContTramites = props.handleContTramites;
    return (
    <div>

        <UserManager />
        <UserFinder />
        <ChangePassword />
        <UserWaitingApproved />
        <MenuProcess
            contTramites={contTramites}
            handleContTramites={handleContTramites}
        >
        </MenuProcess>
    </div>
    );
  }


  const useStyles2 = makeStyles((theme) => ({
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

  export default CustomizedMenus;
  