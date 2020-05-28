import React,{useState} from 'react';
import MenuIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import CustomizedMenus from "./menu";
import SessionCookie from "../../utils/session";
import {createBrowserHistory} from "history";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import ProcessAdministration from "../processAdministration/processAdministration";
import SessionCookies from "../../utils/session";
export const history = createBrowserHistory();

const NavBar =()=>{
    const [contTramites,setContTramites] = useState(0);
    const [sidebarOpen,setSidebarOpen] = useState(false);
    const [sessionUser, setSessionUser] = useState(SessionCookie.GetSessionCookie());
    const handleContTramites=()=>{
        setContTramites(contTramites+1);
    }
    function logOut (){
        SessionCookie.SetSessionCookie(null);
        history.push('/');
        history.go();
    }


    return (<div>
        <AppBar position="static">
            <Toolbar>
                <IconButton

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
        {sidebarOpen &&
        <CustomizedMenus
            contTramites={contTramites}
            handleContTramites={handleContTramites}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sessionUser={sessionUser}
        />
        }
        {!!sessionUser&&<ProcessAdministration/>

        }
    </div>);
}

export default NavBar;