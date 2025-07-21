import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UserServices from '../../services/userServices';
import ProcessServies from '../../services/processServices';
import ProcessRolesServies from '../../services/processRolesServices';
import ProcessForm from '../ventanilla/processForm';
import SessionCookies from '../../src/utils/session';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';


function CustomizedMenus(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);
    const [rowOpen, setRowOpen] = useState();
    const [open, setOpen] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [processName, setProcessName] = useState();
    const [requestNumberPattern, setRequestNumberPattern] = useState();
    const [workflowName, setWorkflowName] = useState();
    const handleContTramites=props.handleContTramites;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClickMenu=(data)=>{
      setOpen(true);
      setProcessName(data.name);
      setWorkflowName(data.workflowName);
      setRequestNumberPattern(data.requestNumberPattern);
      handleClose();
      
    }
    useEffect(()=>{
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
            ProcessServies.GetProcesses({"isPortalFuncionarioRequest":"S","name":{"$in":temp2}}).then((data)=>{
              setRows(data);
            });
            
          });
            

        });

    },[]);
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const handleCloseModal = () => {
      setOpen(false);
      handleContTramites();
    };

    
  
    return (
      <div>
        <div>
          {rows.map((row)=>{
            return(<Button
                variant="contained"

                key={row.name}
                onClick={(e)=>{handleClickMenu(row)}} >
                {row.name}
            </Button>)

          })}
          

        <Dialog fullScreen open={open} >
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
          <ProcessForm
              processName={processName}
              open={open}
              workflowName={workflowName}
              setRowOpen={setRowOpen}
              handleCloseModal={handleCloseModal}
              requestNumberPattern={requestNumberPattern}
          >
          </ProcessForm>
          </Dialog>
          </div>

          
      </div>
    );
  }
  



  export default CustomizedMenus;