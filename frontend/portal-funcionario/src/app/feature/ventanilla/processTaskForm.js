import React, { useState, useEffect } from 'react';
import {Form as Formio}  from 'react-formio';
import ProcessFormServies from '../../services/processFormServices';
import ProcessTaskServices from '../../services/processTaskServices';
import ProcessTaskInformationServices from '../../services/processTaskInformationServices';
import ProcessVariableServices from '../../services/processVariableServices';
import ProcessFormConfigServices from '../../services/processFormConfigServices';
import Button from '@material-ui/core/Button';
import SessionCookies from '../../src/utils/session';
import EmailServices from '../../services/emailServices';
import UserServices from '../../services/userServices';
import ProcessInstanceServices from '../../services/processInstanceServices';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import a11yProps from "../../src/utils/a11yProps";
import RequestDocuments from "../request/requestsDocuments";
import Dialog from "@material-ui/core/Dialog";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TabPanel from '../../src/utils/tabPanel';
import ShowProcessModel from '../displayModel/showProcessModel';
import RequestTaskGeneralInformation from '../request/requestTaskGeneralInformation';
function TaskForm(props) {
    const row =props.information;
    const taskId=props.information.taskId;
    const handleContTramites=props.handleContTramites;
    const handleClose=props.handleClose;
    const processName=props.information.processName;
    const requesterUser=props.information.requesterUser;
    const activityName=props.information.taskName;
    const taskDescription=props.information.taskDescription;
    const [processVariable,setProcessVariable]=useState([]);
    const [value,setValue]=useState(0);
    const [emailVariable,setEmailVariable]=useState([]);
    const [sendEmail,setSendEmail] = useState(false);
    const [uploadFiles,setUploadFiles] = useState(false);
    const [viewFiles,setViewFiles] = useState(false);
    const [processInstanceInformation,setProcessInstanceInformation]=useState();
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
        "taskName":activityName,
        "workflowName":workflowName,
        "processVariable":processVariable,
        "processInstanceId":processInstanceId,
        "taskDescription":taskDescription,
        "user":SessionCookies.GetSessionCookie().authenticated_userid
      })
      .then((data)=>
      {
        
        handleClose();
        handleContTramites();
      });

      if(sendEmail==true) {
          let dataEmail = {
              "variables": emailVariable,
              "data": dataForm.data,
              "processInstanceInformation": processInstanceInformation
          };
          EmailServices.CreateEmail(dataEmail);
      }

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
        ProcessFormConfigServices.GetFormConfig({"processName":processName,"activityName":activityName})
        .then((data)=>{
            let dataV=[];
            data.map((row)=>{
                delete row["_id"];
                if(row.name=="UPLOADFILES") setUploadFiles(true);
                if(row.name=="VIEWFILES") setViewFiles(true);
                if(row.name=="SENDEMAIL") setSendEmail(true);
                dataV.push(row);
            });
            setEmailVariable(dataV);
        });
      ProcessTaskInformationServices.GetProcessesTaskInformation({"processInstanceId":processInstanceId})
      .then((data)=>{
        if(!!data&&data.length>0){
          setData(data[0]);
        }
        
      });
      let instanceData = {"processInstanceId": processInstanceId};
      ProcessInstanceServices.getHistory(instanceData)
        .then((data)=>{
            setProcessInstanceInformation(data[0]);
        })
    },[]);
  
    return (
      <div>


          <AppBar position="static">
              <Tabs value={value} onChange={(e, v)=>setValue(v)} aria-label="simple tabs example">
                  <Tab label="Detalle de la tarea" {...a11yProps(0)} />
                  <Tab label="Información General" {...a11yProps(1)} />
                  {viewFiles&&<Tab label="Documentos" {...a11yProps(2)} />}
                  <Tab label="Estado" {...a11yProps(3)} />
              </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
              <div>
                  <Formio submission={data} params={data.params} src={components} onChange={(data)=>handleChange(data)}></Formio>
                  <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Continuar
                  </Button>
              </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
              <div>
                  <RequestTaskGeneralInformation row={row}/>
              </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
              <div>
                  <RequestDocuments.RequestList row={row} numeroRadicado={row.requestNumber}/>
              </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
              <div>
                  <ShowModel processInstanceId={processInstanceId} />
              </div>
          </TabPanel>
      </div>
    );
  }


  const ShowModel=(props)=>{
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState();
    const processInstanceId = props.processInstanceId;
    useEffect(()=>{
        ProcessInstanceServices.GetDiagram({"processInstanceId":processInstanceId})
            .then((data)=>{
                setFile(data);
                console.log(data);
            });
    },[]);
    return (<div>
        {file!=null&&<ShowProcessModel.Viewer file={file}  fileType="png"/>}
    </div>)
  }
  export default TaskForm;