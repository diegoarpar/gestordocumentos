import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import ProcessDeployServices from '../../services/processDeployServices';


  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

const ProcessInformationTab=(props)=>{
  
  const [processName, setProcessName] = useState(props.information.name);
  const [processDescription, setProcessDescription] = useState(props.information.description);
  const [isAnonymouseRequest, setIsAnonymouseRequest] = useState(props.information.isAnonymouseRequest);
  const [isSedeElectronicaRequest, setIsSedeElectronicaRequest] = useState(props.information.isSedeElectronicaRequest);
  const [isPortalFuncionarioRequest, setIsPortalFuncionarioRequest] = useState(props.information.isPortalFuncionarioRequest);
  const [workflowName, setWorkflowName] = useState(props.information.workflowName);
  const [modalType, setModalType] = useState(props.modalType);
  const [processFile, setProcessFile] = useState();
  const classes = useStyles;
  const handleClick=props.handleClick;
  const handleUploadFile=(e)=>{
    if(!!e&&!!e.target&&!!e.target.files&&e.target.files.length>0){
      setProcessFile(e.target.files[0]);
    }
    
  }
  const handleConfirmUploadFile=(e)=>{
    
    var data = new FormData();
    data.append('file', processFile);
    ProcessDeployServices.ProcessesDeploy(data);
  }

  return (<div>
          <CustomInput
            labelText="Nombre ..."
            id="setProcessName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:processName,
              onChange: (e) => {setProcessName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Descripción..."
            id="setProcessDescription"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:processDescription,
              onChange: (e) => {setProcessDescription(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Nombre del Workflow..."
            id="setWorkflowName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:workflowName,
              onChange: (e) => {setWorkflowName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Permite radicación anónima..."
            id="setIsAnonymouseRequest"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:isAnonymouseRequest,
              onChange: (e) => {setIsAnonymouseRequest(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Permite radicación sede electrónica..."
            id="setIsSedeElectronicaRequest"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:isSedeElectronicaRequest,
              onChange: (e) => {setIsSedeElectronicaRequest(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />

          <CustomInput
            labelText="Permite radicación portal funcionario..."
            id="setIsPortalFuncionarioRequest"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:isPortalFuncionarioRequest,
              onChange: (e) => {setIsPortalFuncionarioRequest(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />

          
          {<Button variant="contained" color="primary"  
            onClick={(e) => {
              handleClick(e,{"name":processName,
                            "description":processDescription,
                            "workflowName":workflowName,
                            "isAnonymouseRequest":isAnonymouseRequest,
                            "isPortalFuncionarioRequest":isPortalFuncionarioRequest,
                            "isSedeElectronicaRequest":isSedeElectronicaRequest
                            },modalType);
              
              }}>
                            {modalType=="C"?"Agregar":"Guardar Cambios"}
          </Button>
          }
         
         {modalType=="M"&&
            <div>
              <CustomInput
            labelText=""
            id="setFileUpload"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "file",
              onChange: (e) => {handleUploadFile(e)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
              <Button variant="contained" color="primary"  
                onClick={(e) => {
                  handleConfirmUploadFile();
                  
                  }}>
                              Actualizar proceso
              </Button>
              
            </div>
          }
          
          
          

  </div>);
}





export default ProcessInformationTab;