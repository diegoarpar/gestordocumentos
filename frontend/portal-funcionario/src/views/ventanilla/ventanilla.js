import React,{ useState,useEffect } from 'react';
import MenuProcess from './menuProcess'
import TaskInformation from './tasksInformation'


const VentanillaRadicacion=(props)=>{
    const [contTramites,setContTramites] = useState(0);
    const handleContTramites=()=>{
        setContTramites(contTramites+1);
    }
    return (<div>
            Aquí está la VentanillaRadicacion
            <MenuProcess
            contTramites={contTramites}
            handleContTramites={handleContTramites}
            >
            </MenuProcess>


            <TaskInformation
            contTramites={contTramites}
            handleContTramites={handleContTramites}
                  >
            </TaskInformation>

    </div>);

}

export default VentanillaRadicacion;