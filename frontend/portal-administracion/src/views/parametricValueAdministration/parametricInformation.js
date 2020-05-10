import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import a11yProps from "../../utils/a11yProps";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

const ParametricInformationTab=(props)=>{
  
  const [name, setName] = useState(props.information.name);
  const [description, setDescription] = useState(props.information.description);
  const [value, setValue] = useState(props.information.value);
  const [type, setType] = useState(props.information.type);
  const [listIndex, setListIndex] = useState(-1);
  const [typeDescription, setTypeDescription] = useState(props.information.typeDescription);
  const [modalType, setModalType] = useState(props.modalType);
  const classes = useStyles;
  const handleClick=props.handleClick;
  const handleClose=props.handleClose;
  const handleChangeList=(e)=>{
    setListIndex(e.target.value);
    setType(typeList[e.target.value].id);
    setTypeDescription(typeList[e.target.value].label);
  }
  const typeList=[
    {label:"Rol Proceso", id:"ROL_PROCESO"},
    {label:"Portales", id:"PORTALES"},
    {label:"Rol Plataforma", id:"ROL_PLATAFORMA"},
    {label:"Módulo funcionario", id:"MODULO_FUNCIONARIO"}
  ];
  return (<div>
        <div>
        <FormControl >
            <InputLabel id="type">Tipo</InputLabel>
            <Select
              id="simple-select"
              value={listIndex}
              onChange={handleChangeList}
            >
              {typeList.map((item,index) => (
                    <MenuItem key={item.id}  value={index}>{item.label}</MenuItem>
                  ))}
              
            </Select>
          </FormControl>
          </div>
          <CustomInput
            labelText="Nombre..."
            id="setName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:name,
              onChange: (e) => {setName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Descripcion..."
            id="setDescription"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:description,
              onChange: (e) => {setDescription(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Valor..."
            id="setValue"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:value,
              onChange: (e) => {setValue(e.target.value)},
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
              handleClick(e,{"name":name,
                            "description":description,
                            "type":type,
                            "typeDescription":typeDescription,
                            "value":value,
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
const ParametricInformation =(props)=>{
  const [value, setValue] = useState(0);
  const [information, setInformation] = useState(props.information);
  const [modalType, setModalType] = useState(props.modalType);
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
              <Tab label="" {...a11yProps(1)} />
              <Tab label="" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <div>
                  <ParametricInformationTab
                    information={information} 
                    modalType={modalType} 
                    handleClick={handleClick} 
                    handleClose={handleClose}
                  />
                    </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
                
          </TabPanel>
          <TabPanel value={value} index={2}>
              
          </TabPanel>
          
          </div>
      );
  }

  
export default ParametricInformation;