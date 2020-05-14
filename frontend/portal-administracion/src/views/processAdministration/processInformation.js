import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import a11yProps from "../../utils/a11yProps";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProcessRolesTable from "./processRolesTable";

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
          
          

  </div>);
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'} variant={'body2'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const ProcessInformation =(props)=>{
  const [value, setValue] = useState(0);
  const [information, setInformation] = useState(props.information);
  const [modalType, setModalType] = useState(props.modalType);
  const handleClick=props.handleClick;
  const handleClose=props.handleClose;
  const handleModalOC=props.handleModalOC;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
      <div>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Información" {...a11yProps(0)} />
              {modalType=="M"&&<Tab label="Roles asociados" {...a11yProps(1)} 
              />}
             
              {modalType=="M"&&<Tab label="" {...a11yProps(2)} 
              />}
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <div>
                  <ProcessInformationTab
                    information={information} 
                    modalType={modalType} 
                    handleClick={handleClick} 
                    handleClose={handleClose}
                  />
                    </div>
          </TabPanel>
         { modalType=="M"&&<TabPanel value={value} index={1}>
          <div>
                  <ProcessRolesTable
                    information={information} 
                    modalType={modalType} 
                    handleClick={handleClick} 
                    handleClose={handleClose}
                  />
                    </div>
                
          </TabPanel>
        }
          { modalType=="M"&&<TabPanel value={value} index={2}>
          <div>
                  
                    </div>
                
          </TabPanel>
        }
          <Button variant="contained" color="secondary"  
              onClick={(e) => {
                handleClose();

              }}>
              Cerrar
          </Button>
          </div>
      );
  }

export default ProcessInformation;