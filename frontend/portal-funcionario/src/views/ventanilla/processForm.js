import React, { useState, useEffect } from 'react';
import {Form as Formio} from 'react-formio' ;
import ProcessFormServies from '../../services/processFormServices';
import ProcessInstanceServices from '../../services/processInstanceServices';
import FileManagementServices from'../../services/fileManagementServices';
import UserServices from '../../services/userServices';
import Button from '@material-ui/core/Button';
import SessionCookie from '../../utils/session';
import FileUtils from '../../utils/fileUtils';

function ProcessForm(props) {
  
    const processName=props.processName;
    const workflowName=props.workflowName;
    const requestNumberPattern=props.requestNumberPattern;
    const [components,setComponents]=useState({"type":"form","display":"form","components":[]});
    const handleCloseModal=props.handleCloseModal;
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
            let userId = {'user':SessionCookie.GetSessionCookie().authenticated_userid};
            UserServices.GetUser(userId).then((data)=>{
                [dataForm.data, files] = FileUtils.extraerArchivosFormulario(dataForm.data);
                let persona = {
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
                        "requesterF":persona,
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
        
        
          <Formio src={components} onChange={(data)=>handleChange(data)}></Formio>
          <Button variant="contained" color="primary"  onClick={(e) => {onClick(e)}}>
                      Radicar
                    </Button>
      </div>
    );
  }

  export default ProcessForm;