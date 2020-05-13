import React,{ useState,useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProcessServices from '../../services/processServices'
import ProcessInformation from './processInformation'
import Modal from '@material-ui/core/Modal';
import ProcessRolesServices from '../../services/processServicesRoles'
import a11yProps from "../../utils/a11yProps";
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ProcessForm from "./processForm";
import ProcessAdministrationTable from "./processAdministrationTable";

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
const ProcessAdministration =(props)=>{
  const [value, setValue] = React.useState(0);
  const [rowInformation, setRowInformation] = React.useState(props.rowInformation);
  const [modalType, setModalType] = React.useState(props.modalType);
  const handleCreateUser=props.handleCreateUser;
  const handleClose=props.handleClose;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
      <div>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Trámites" {...a11yProps(0)} />
              {rowInformation!=null&&<Tab label={"Formulario "+ rowInformation.name} {...a11yProps(1)} />}
              <Tab label="" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <div>
                  <ProcessAdministrationTable handleRowInformation={setRowInformation}/>
                    </div>
          </TabPanel>
          {rowInformation!=null&&<TabPanel value={value} index={1}>
              <ProcessForm
                    information={rowInformation} 
                    
                  />
          </TabPanel>
          }
          <TabPanel value={value} index={2}>
              
          </TabPanel>
          
          </div>
      );
  }
export default ProcessAdministration;