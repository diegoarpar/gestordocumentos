import React,{ useState,useEffect } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/icons/Book';
import MenuIcon from '@material-ui/icons/MenuOpen';
import Login from '../login/login';
import MenuProcess from '../menus/menuProcess';
import UserManager from '../user/userManager';


const NavBar =()=>{
    const [contTramites, setContTramites] = useState(0);
    const handleContTramites =()=>{
        setContTramites(contTramites+1);
    }
    return (<AppBar position="static">
    <Toolbar>
        <MenuProcess contTramites={contTramites} handleContTramites={handleContTramites} />
        <Typography variant="h6" >
            
        </Typography>
        <Login  handleContTramites={handleContTramites}/>
        
        </Toolbar>
    </AppBar>
  )
}

export default NavBar;