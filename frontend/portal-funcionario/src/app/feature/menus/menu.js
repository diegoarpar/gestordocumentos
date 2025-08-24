import React, {useState} from 'react';
import { withStyles, styled} from "@mui/material/styles";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import MenuProcess from './menuProcess';
import UserManager from "../user/userManager";
import UserFinder from "../user/userFinder";
import ChangePassword from "../user/changePassword";
import UserWaitingApproved from "../user/userWaitingApproved";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RequestInformation from "../request/requestsInformation";

function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const history= props.history;
    const [sessionUser, setSessionUser] = '';
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
        <Drawer rootClassName={classes.root}
              overlayClassName={classes.overlay}
              sidebarClassName={classes.sidebar}
              dragToggleDistance={4}
              rootClassName={classes.root}
              open={sidebarOpen}
              onSetOpen={onSetSidebarOpen}
            >
              <div className={classes.overlay}>
                <button onClick={(e) => setSidebarOpen(!sidebarOpen)} className='btn primary'>
                  X
                </button>
              </div>
              <List>
                {rows.map((data) => {
                  return (<>
                    <ListItem disablePadding>
                      <ListItemButton component="a" href={data.path}>
                        <ListItemText primary={data.description} />
                      </ListItemButton>
                    </ListItem>
                  </>)
                })}
              </List>
            </Drawer>
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
        <RequestInformation/>
        <MenuProcess
            contTramites={contTramites}
            handleContTramites={handleContTramites}
        >
        </MenuProcess>

    </div>
    );
  }


  const useStyles2 = styled((theme) => ({
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
  