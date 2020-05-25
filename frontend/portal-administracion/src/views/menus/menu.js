import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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

function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history= props.history;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const rows =[
      {"name":"administracionusuarios", "path":"/userAdministration", "description":"Administración de usuarios"},
      {"name":"administraciontramites", "path":"/workflowAdministration", "description":"Administración de trámites"},
      {"name":"administracionparametricas", "path":"/parametricAdministration", "description":"Administración de Paramétricas"},
      {"name":"administracionsedeelectronica", "path":"/sedeElectronicaAdminsitration", "description":"Administración sede electrónica"},
      {"name":"inicio", "path":"/", "description":"Inicio"}

    ];
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
          Menú
        </Button>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {
            rows.map((row, index)=>{
              return (
              <StyledMenuItem key={index}>
                <ListItemText key={index+"L"} primary={row.description} 
                    onClick={(e)=>{history.push(row.path); history.go();}} 
                />
              </StyledMenuItem>
              )
            })
          }
          
        </StyledMenu>
      </div>
    );
  }
  

  export default CustomizedMenus;