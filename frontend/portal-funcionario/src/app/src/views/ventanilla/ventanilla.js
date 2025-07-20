import React,{ useState,useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TaskInformation from './tasksInformation'
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Menu from '../menus/menu';
import MenuIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SessionCookie from "../../utils/session";
import {createBrowserHistory} from "history";
export const history = createBrowserHistory();

const VentanillaRadicacion=(props)=>{
    const [contTramites,setContTramites] = useState(0);
    const [sidebarOpen,setSidebarOpen] = useState(false);
    const handleContTramites=()=>{
        setContTramites(contTramites+1);
    }
    function logOut (){
        SessionCookie.SetSessionCookie(null);
        history.push('/');
        history.go();
    }
    const classes=useStyles();
    const [sessionUser, setSessionUser] = useState(SessionCookie.GetSessionCookie());
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
                {"Bienvenido al portal del funcionario "+sessionUser.authenticated_userid}
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


const useStyles = makeStyles((theme) => ({
    buttonSidebar :{
        zIndex: 10
    }
}));
export default VentanillaRadicacion;