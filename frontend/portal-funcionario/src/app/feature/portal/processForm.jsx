import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import ProcessFormServies from '@/app/api/processFormServices';
import ProcessInstanceServices from '@/app/api/processInstanceServices';
import FileManagementServices from'@/app/api/fileManagementServices';
import Button from '@mui/material/Button';
import FileUtils from '../../src/utils/fileUtils';
import UserFinder from "../user/userFinder";
import UserDetailDialog from "../user/userDetailDialog";

function ProcessForm(props) {
  
    const Formio = dynamic(
      () => import("@formio/react").then((mod) => mod.Form),
      { ssr: false }
    );
    const processName=props.processName;
    const workflowName=props.workflowName;
    const requestNumberPattern=props.requestNumberPattern;
    const [components,setComponents]=useState({"type":"form","display":"form","components":[]});
    const handleCloseModal=props.handleCloseModal;
    const [citizen,setCitizen]= useState();
    var dataForm;
    var files;
    const handleChange=(data)=>{
        dataForm=data;
    };
    const onClick=()=>{
        let numeroRadicadoReq={
            "processName":processName,
            "format":requestNumberPattern.value,
            "display":requestNumberPattern.description
        };
        let numeroRadicado = "";
        ProcessInstanceServices.getRequestNumber(numeroRadicadoReq).then((data)=>{
            numeroRadicado = data.number;
            //llamado obtenecconr informacion usario
            let userId = {'user':'GetSessionCookie().authenticated_userid'};
            UserServices.GetUser(userId).then((data)=>{
                [dataForm.data, files] = FileUtils.extraerArchivosFormulario(dataForm.data);

                let persona = {
                    "numeroRadicado":numeroRadicado,
                    "tipoDocumento":citizen.documentNumber,
                    "numeroDocumento":citizen.documentType,
                    "nombre":citizen.name,
                    "apellido":citizen.lastName,
                    "email":citizen.email,
                    "user":citizen.user,
                    "expediente":{},
                    "documentos":files
                };
                let requesterF = {
                    "numeroRadicado":numeroRadicado,
                    "tipoDocumento":data[0].documentNumber,
                    "numeroDocumento":data[0].documentType,
                    "nombre":data[0].name,
                    "apellido":data[0].lastName,
                    "email":data[0].email,
                    "user":userId.user,
                    "expediente":{},
                    "documentos":files
                };
                FileManagementServices.radicarDocumentos(persona).then((data)=>{
                    ProcessInstanceServices.InitProcesses({
                        "processName":processName,
                        "workflowName":workflowName,
                        "requestNumber":numeroRadicado,
                        "requesterF":requesterF,
                        "requester":persona,
                        "data":dataForm.data})
                        .then((data)=>
                        {
                            handleCloseModal();
                        });
                });
            });
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
          <UserFinder setCitizen={setCitizen}/>
            {!!citizen&&<div>
                <UserDetailDialog row={citizen}/>
            </div>
            }
          <Formio src={components} onChange={(data)=>handleChange(data)}></Formio>
          <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Radicar
                    </Button>
      </div>
    );
  }

  export default ProcessForm;