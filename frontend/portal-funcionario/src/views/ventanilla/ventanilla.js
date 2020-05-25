import React,{ useState,useEffect } from 'react';
import MenuProcess from './menuProcess'
import TaskInformation from './tasksInformation'
import UserManager from '../user/userManager';
import UserFinder from '../user/userFinder';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';


const VentanillaRadicacion=(props)=>{
    const [contTramites,setContTramites] = useState(0);
    const handleContTramites=()=>{
        setContTramites(contTramites+1);
    }
    return (<div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" >
                    
                </Typography>
                <MenuProcess
                    contTramites={contTramites}
                    handleContTramites={handleContTramites}
                >
                </MenuProcess>
                <UserManager />
                <UserFinder />
                
                
                </Toolbar>
        </AppBar>
        
        <TaskInformation
                    contTramites={contTramites}
                    handleContTramites={handleContTramites}
                    >
                </TaskInformation>
    </div>);

}

export default VentanillaRadicacion;