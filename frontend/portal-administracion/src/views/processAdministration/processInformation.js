import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import a11yProps from "../../utils/a11yProps";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProcessRolesTable from "./processRolesTable";
import ProcessInformationTab from "./processInformationTab";
import ProcessActivityTable from "./processActivityTable";
import ProcessVariableTable from "./processVariableTable";
import ProcessFormConfigTable from "./processFormConfigTable";

  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

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
  const information= props.information;
  const modalType = props.modalType;
  const handleClick=props.handleClick;
  const handleClose=props.handleClose;
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
              {modalType=="M"&&<Tab label="Actividades Asociadas" {...a11yProps(2)} 
              />}
              {modalType=="M"&&<Tab label="Variables de Proceso" {...a11yProps(3)} 
              />}
                {modalType=="M"&&<Tab label="Config Formularios" {...a11yProps(4)}
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
                <ProcessActivityTable
                   information={information} 
                   modalType={modalType} 
                   handleClick={handleClick} 
                   handleClose={handleClose}
                />  
                    </div>
                
          </TabPanel>
        }
        { modalType=="M"&&<TabPanel value={value} index={3}>
          <div>
                <ProcessVariableTable
                   information={information} 
                   modalType={modalType} 
                   handleClick={handleClick} 
                   handleClose={handleClose}
                />  
                    </div>
                
          </TabPanel>
        }
          { modalType=="M"&&<TabPanel value={value} index={4}>
              <div>
                  <ProcessFormConfigTable
                      information={information}
                      modalType={modalType}
                      handleClick={handleClick}
                      handleClose={handleClose}
                  />
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