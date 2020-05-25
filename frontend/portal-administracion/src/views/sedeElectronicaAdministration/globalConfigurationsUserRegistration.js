import React,{ useState,useEffect } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import ListItem from '@material-ui/core/ListItem';
import CustomInput from "components/CustomInput/CustomInput.js";

import SedeElectronciaGeneralServices from '../../services/sedeElectronicaGeneralServices';

const GlobalConfigurationsUserRegistration =(props)=>{
    const open =props.open;
    const handleClose=props.handleClose;
    
    return (
    <div>
        
        <Dialog fullScreen open={open} onClose={handleClose} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Modificar Información
              </Typography>
            </Toolbar>
          </AppBar>
          <DetailInformation  ></DetailInformation>  
        </Dialog>
    </div>
    );
}

const DetailInformation=(props)=>{
    const [enrollinglistIndex, setEnrollinglistIndex]=useState(-1);
    const [enrollinglistItem, setEnrollinglistItem]=useState();
    const [rows2, setRows2]=useState([]);
    const [cont, setCont]=useState(0);
    const enrollingList= [
        {"value":"auto", "description":"Auto enrolamiento", "type":"EXTERNAL_REGISTRY", "type2":"enroll"},
        {"value":"with_manual_checked", "description":"Auto con verificación manual", "type":"EXTERNAL_REGISTRY", "type2":"enroll"},
        {"value":"database", "description":"Desde base de datos", "type":"EXTERNAL_REGISTRY", "type2":"enroll"},
        {"value":"SS", "description":"Expuesto sede electrónica", "type":"EXTERNAL_REGISTRY", "type2":"visibilitySede"},
        {"value":"SN", "description":"No expuesto sede electrónica", "type":"EXTERNAL_REGISTRY", "type2":"visibilitySede"},
        {"value":"VS", "description":"Expuesto en ventanilla", "type":"EXTERNAL_REGISTRY", "type2":"visibilityVentanilla"},
        {"value":"VN", "description":"No expuesto en ventanilla", "type":"EXTERNAL_REGISTRY", "type2":"visibilityVentanilla"}
    ];
    const handleChangeEnrollingList=(e)=>{
        setEnrollinglistIndex(e.target.value);
        enrollingList.map((item,index) => {
            if(item.value==e.target.value){
                setEnrollinglistItem(item);
                return;
            }  
        });
    }
    const handleSaveTipoRegistroExterno=()=>{
        
        SedeElectronciaGeneralServices.CreateSedeElectronicaGeneral(enrollinglistItem)
        .then((data)=>{
                setCont(cont+1);
            });
        
    }
    const handleDeleteConfig=(row)=>{
        delete row._id;
        SedeElectronciaGeneralServices.DeleteSedeElectronicaGeneral(row)
            .then((data)=>{
                setCont(cont+1);
            });
        
    }
    useEffect(()=>{
        SedeElectronciaGeneralServices.GetSedeElectronicaGeneral({"type":"EXTERNAL_REGISTRY"})
        .then((data)=>{
            setRows2(data);
        });
    },[cont])
    return (
        <div>
        <div >
            
            <FormControl>
                <InputLabel id="select">Tipo de registro externo</InputLabel>
                <Select
                    id="imple-select2"
                    value={enrollinglistIndex}
                    onChange={(e)=>handleChangeEnrollingList(e)}
                    >
                    {enrollingList.map((item,index) => (
                            <MenuItem key={index}  value={item.value}>{item.description}</MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary"  
                onClick={(e) => {
                    handleSaveTipoRegistroExterno();

                }}>
                Agregar
            </Button>
            <div>
            
      </div>
            <h2>Configuraciones</h2>
                    <List  subheader={<li />}>
                {!!rows2&&!!rows2.map&&rows2.map((row, idx) => (
                <li key={`section-${row.value}`} >
                    <ul >
                        <ListItem key={`item-${row.value}-`}>
                        {row.description}  
                        </ListItem>
                        <Button variant="contained" color="primary"  
                            onClick={(e) => {
                                handleDeleteConfig(row);

                            }}>
                            Eliminar
                        </Button>
                    </ul>
                </li>
                ))}
                 
            </List>
            </div>
      </div>
    );
}
export default GlobalConfigurationsUserRegistration;