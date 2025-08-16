'use client'
import React,{ useState,useEffect } from 'react';
import { styled, withStyles } from "@mui/material/styles";
import TaskInformation from './tasksInformation'
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Menu from '../menus/menu';
import MenuIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const VentanillaRadicacion=(props)=>{
    const [contTramites,setContTramites] = useState(0);
    const [sidebarOpen,setSidebarOpen] = useState(false);
    const handleContTramites=()=>{
        setContTramites(contTramites+1);
    }
    function logOut (){

    }
    const classes=useStyles();
    
    return (<div>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    className={classes.buttonSidebar}
                    edge="start"  color="inherit"
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e)=>{setSidebarOpen(true);}}

                >
                    <MenuIcon/>
                </IconButton>
                {"Bienvenido al portal del funcionario "}
                <Button  color="inherit"  variant="outlined" onClick={(e) => {logOut(e)}}>
                    Cerrar Sesión
                </Button>


                <Typography variant="h6" >
                    
                </Typography>

                </Toolbar>
        </AppBar>

        {sidebarOpen&&<Menu
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            contTramites={contTramites}
            handleContTramites={handleContTramites}
        >
        </Menu>
        }
        <TaskInformation
                    contTramites={contTramites}
                    handleContTramites={handleContTramites}
                    >
                </TaskInformation>

    </div>);

}


const useStyles = styled((theme) => ({
    buttonSidebar :{
        zIndex: 10
    }
}));
export default VentanillaRadicacion;