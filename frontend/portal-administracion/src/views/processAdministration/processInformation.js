import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";

  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

const ProcessInformation=(props)=>{
  
  const [processName, setProcessName] = useState(props.processInformation.name);
  const [processDescription, setProcessDescription] = useState(props.processInformation.description);
  const [isAnonymouseRequest, setIsAnonymouseRequest] = useState(props.processInformation.isAnonymouseRequest);
  const [workflowName, setWorkflowName] = useState(props.processInformation.workflowName);
  const [modalType, setModalType] = useState(props.modalType);
  const classes = useStyles;
  const handleClick=props.handleClick;
  const handleClose=props.handleClose;

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

          
          {<Button variant="contained" color="primary"  
            onClick={(e) => {
              handleClick(e,{"name":processName,
                            "description":processDescription,
                            "workflowName":workflowName,
                            "isAnonymouseRequest":isAnonymouseRequest,
                            },modalType);
              
              }}>
                            {modalType=="C"?"Agregar":"Guardar Cambios"}
          </Button>
          }
          
          <Button variant="contained" color="secondary"  
              onClick={(e) => {
                handleClose();

              }}>
              Cerrar
          </Button>

  </div>);
}


export default ProcessInformation;