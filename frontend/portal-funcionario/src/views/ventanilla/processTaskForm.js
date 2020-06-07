import React, { useState, useEffect } from 'react';
import {Form as Formio}  from 'react-formio';
import ProcessFormServies from '../../services/processFormServices';
import ProcessTaskServices from '../../services/processTaskServices';
import ProcessTaskInformationServices from '../../services/processTaskInformationServices';
import ProcessVariableServices from '../../services/processVariableServices';
import Button from '@material-ui/core/Button';
import SessionCookies from '../../utils/session';


function TaskForm(props) {
    
    const taskId=props.information.taskId;
    const handleContTramites=props.handleContTramites;
    const handleClose=props.handleClose;
    const processName=props.information.processName;
    const activityName=props.information.taskName;
    const [processVariable,setProcessVariable]=useState([]);
    const [data,setData]=useState({"data":{}});
    const workflowName=props.information.workflowName;
    const processInstanceId=props.information.processInstanceId;
    const [components,setComponents]=useState({"type":"form","display":"form","components":[]});
    var dataForm;
    const handleChange=(data)=>{
      dataForm=data;
    }
    const onClick=()=>{
      
      ProcessTaskServices.CompleteTask({
        "taskId":taskId,
        "data":dataForm.data,
        "activityName":activityName,
        "workflowName":workflowName,
        "processVariable":processVariable,
        "processInstanceId":processInstanceId,
        "user":SessionCookies.GetSessionCookie().authenticated_userid
      })
      .then((data)=>
      {
        
        handleClose();
        handleContTramites();
      });
    }
    useEffect(()=>{
      ProcessFormServies.GetProcessesForm({"processName":processName,"activityName":activityName}).then((rta)=>{
        
        if(!!rta&&rta.length>0){
          rta[0].type="form";
          rta[0].display="form";
          setComponents(rta[0]);
          
        }
        
      });
      ProcessVariableServices.GetProcessesVariable({"processName":processName,"activityName":activityName})
      .then((data)=>{
        setProcessVariable(data);
      });

      ProcessTaskInformationServices.GetProcessesTaskInformation({"processInstanceId":processInstanceId})
      .then((data)=>{
        if(!!data&&data.length>0){
          setData(data[0]);
        }
        
      });
      
    },[]);
  
    return (
      <div>
        
        
          <Formio submission={data} params={data.params} src={components} onChange={(data)=>handleChange(data)}></Formio>
          <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Continuar
                    </Button>
      </div>
    );
  }
  
  
  export default TaskForm;