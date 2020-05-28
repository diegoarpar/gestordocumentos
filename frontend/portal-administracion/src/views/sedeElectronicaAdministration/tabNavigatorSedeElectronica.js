import React,{ useState,useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import a11yProps from "../../utils/a11yProps";
import ArrowBack from '@material-ui/icons/ArrowBack';
import GlobalConfigurations from './globalConfigurations';


const TabNavigatorSedeElectronicaConfiguration =()=>{
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
    return (
        <div>
        <AppBar position="static">
            <Tabs value={value} onChange={(e)=>handleChange} aria-label="simple tabs example">
              <Tab label="Configuraciones Globales" {...a11yProps(0)} />
              {true&&<Tab label={"Otras configuraciones "} {...a11yProps(1)} />}
              <Tab label="" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <GlobalConfigurations/>
          </TabPanel>
          {true&&<TabPanel value={value} index={1}>
              
          </TabPanel>
          }
          <TabPanel value={value} index={2}>
              
          </TabPanel>
          
          </div>
      );
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
export default TabNavigatorSedeElectronicaConfiguration;