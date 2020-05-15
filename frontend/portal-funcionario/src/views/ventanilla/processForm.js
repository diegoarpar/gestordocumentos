import React, { useState, useEffect } from 'react';
import {Form} from 'react-formio';
import ProcessFormServies from '../../services/processFormServices';
import ProcessInstanceServices from '../../services/processInstanceServices';
import Button from '@material-ui/core/Button';

function ProcessForm(props) {
  
    const [processName,setProcessName]=useState(props.processName);
    const [workflowName,setWorkflowName]=useState(props.workflowName);
    const [components,setComponents]=useState({"type":"form","display":"form","components":[]});
    var dataForm;
    const handleChange=(data)=>{
      dataForm=data;
    }
    const onClick=()=>{
      ProcessInstanceServices.InitProcesses({
        "processName":processName,
        "workflowName":workflowName,
        "data":dataForm.data})
        .then((data)=>
          {
            console.log(data);
          });
    }
    useEffect(()=>{
      ProcessFormServies.GetProcessesForm({"processName":processName,"activityName":"00_RADICAR"}).then((rta)=>{
        
        if(!!rta&&rta.length>0){
          rta[0].type="form";
          rta[0].display="form";
          setComponents(rta[0]);
          
        }
        
      });
    },[]);
  
    return (
      <div>
        
        
          <Form src={components} onChange={(data)=>handleChange(data)}></Form>
          <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Radicar
                    </Button>
      </div>
    );
  }
  
  
  export default ProcessForm;