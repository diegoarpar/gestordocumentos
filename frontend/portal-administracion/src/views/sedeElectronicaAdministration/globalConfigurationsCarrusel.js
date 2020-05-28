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

const GlobalConfigurationsCarrusel =(props)=>{
    const open =props.openM;
    const handleClose=props.handleCloseM;
    
    return (
    <div>
        
        <Dialog fullScreen open={open}  >
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
    const [rows2, setRows2]=useState([]);
    const [cont, setCont]=useState(0);
    const [description, setDescription]=useState();
    const [name, setName]=useState();
    const handleChangeEnrollingList=(e)=>{
        
    }
    const handleSaveTipoRegistroExterno=()=>{
        
        SedeElectronciaGeneralServices.CreateSedeElectronicaGeneral({"value":name,"description":description,"type":"CARRUSEL_ITEM"})
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
        SedeElectronciaGeneralServices.GetSedeElectronicaGeneral({"type":"CARRUSEL_ITEM"})
        .then((data)=>{
            setRows2(data);
        });
    },[cont])
    return (
        <div>
        <div >
        <CustomInput
            labelText="Nombre..."
            id="setName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
                rows: "4",
              type: "text",
              onChange: (e) => {setName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People  />
                </InputAdornment>
              )
            }
          }
          />   
        <CustomInput
            labelText="Descripción..."
            id="setDescription"
            multiline 
            rows={4}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
                rows: "4",
              type: "text",
              onChange: (e) => {setDescription(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People  />
                </InputAdornment>
              )
            }
          }
          />
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
                        {row.value+": "+row.description}  
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
export default GlobalConfigurationsCarrusel;
