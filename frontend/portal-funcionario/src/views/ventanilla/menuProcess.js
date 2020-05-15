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
import ProcessForm from './processForm';
import SessionCookies from '../../utils/session';
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
    const [workflowName, setWorkflowName] = useState();
    const setProcessNameVentanilla=props.setProcessName;
    const setWorkflowNameVentanilla=props.setWorkflowName;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClickMenu=(data)=>{
      setOpen(true);
      setProcessName(data.name);
      setProcessNameVentanilla(data.name);
      setWorkflowNameVentanilla(data.workflowName);
      setWorkflowName(data.workflowName);
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
    };

    
  
    return (
      <div>
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Radicar Trámites
        </Button>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {rows.map((row)=>{
            return(<StyledMenuItem key={row.name} onClick={(e)=>{handleClickMenu(row)}} >
              <ListItemIcon key={row.name}>
                
              </ListItemIcon>
              <ListItemText primary={row.name} 
                  onClick={(e)=>{handleClickMenu(row)}} 
              />
            </StyledMenuItem>)

          })}
          
        </StyledMenu>
        <Dialog fullScreen open={open} onClose={handleCloseModal} >
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
          <ProcessForm processName={processName} open={open} workflowName={workflowName} setRowOpen={setRowOpen}></ProcessForm>
          </Dialog>
          
      </div>
    );
  }
  
  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  export default CustomizedMenus;