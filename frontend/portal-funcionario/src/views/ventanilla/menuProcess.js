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
import SessionCookies from '../../utils/session';




function CustomizedMenus(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);
    const history= props.history;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

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
            ProcessServies.GetProcesses({"name":{"$in":temp2}}).then((data)=>{
              setRows(data);
            });
            
          });
            

        });

    },[]);
  
    const handleClose = () => {
      setAnchorEl(null);
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
            return(<StyledMenuItem key={row.name}>>
              <ListItemIcon key={row.name}>
                
              </ListItemIcon>
              <ListItemText primary={row.name} 
                  onClick={(e)=>{history.push('/ventanillaRadicacion'); history.go();}} 
              />
            </StyledMenuItem>)

          })}
          
        </StyledMenu>
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