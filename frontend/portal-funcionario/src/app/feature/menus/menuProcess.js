import React, { useState, useEffect } from 'react';
import { withStyles } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UserServices from '@/app/api/userServices';
import ProcessServies from '@/app/api/processServices';
import ProcessRolesServies from '@/app/api/processRolesServices';
import ProcessForm from '../portal/processForm';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';


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
        UserServices.GetRolesProcess({"user":''}).then((data)=>{
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