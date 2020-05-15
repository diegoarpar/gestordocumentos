import React, { useState, useEffect } from 'react';
import {Form} from 'react-formio';
import ProcessFormServies from '../../services/processFormServices';
import ProcessTaskServices from '../../services/processTaskServices';
import ProcessVariableServices from '../../services/processVariableServices';
import Button from '@material-ui/core/Button';
import SessionCookies from '../../utils/session';

function TaskForm(props) {
    
    const taskId=props.information.taskId;
    const handleClose=props.handleClose;
    const [processName,setProcessName]=useState(props.information.processName);
    const [activityName,setActivityName]=useState(props.information.taskName);
    const [processVariable,setProcessVariable]=useState([]);
    const [workflowName,setWorkflowName]=useState(props.information.workflowName);
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
        "user":SessionCookies.GetSessionCookie().authenticated_userid
      })
      .then((data)=>
      {
        console.log(data);
        handleClose();
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
    },[]);
  
    return (
      <div>
        
        
          <Form src={components} onChange={(data)=>handleChange(data)}></Form>
          <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Continuar
                    </Button>
      </div>
    );
  }
  
  
  export default TaskForm;