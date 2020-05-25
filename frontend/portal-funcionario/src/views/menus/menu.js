import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/MoreVert';


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
      {"name":"ventanillaRadicacion", "path":"/ventanillaRadicacion", "description":"Ventanilla de radicación"},
      {"name":"userWatingApproved", "path":"/userWatingApproved", "description":"Aprobación de usuarios"},

    ];
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <IconButton
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
           <MenuIcon/>
        </IconButton>
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