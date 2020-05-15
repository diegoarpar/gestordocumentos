import React,{ useState,useEffect } from 'react';
import MenuProcess from './menuProcess'
import TaskInformation from './tasksInformation'

const VentanillaRadicacion=(props)=>{
    const [processName,setProcessName]=useState();
    const [workFlowName,setWorkflowName]=useState();
    return (<div>
            Aquí está la VentanillaRadicacion
            <MenuProcess
                setProcessName={setProcessName}
                setWorkflowName={setWorkflowName}
            >
            </MenuProcess>
            <TaskInformation
                  >
            </TaskInformation>

    </div>);

}

export default VentanillaRadicacion;