import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

  

const ParametricInformation=(props)=>{
  
  const [name, setName] = useState(props.information.name);
  const [description, setDescription] = useState(props.information.description);
  const [value, setValue] = useState(props.information.value);
  const [type, setType] = useState(props.information.type);
  const [listIndex, setListIndex] = useState();
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
        <FormControl >
            <InputLabel id="setType">Tipo</InputLabel>
            <Select
              id="imple-select"
              value={typeDescription}
              onChange={handleChangeList}
            >
              {typeList.map((item,index) => (
                    <MenuItem key={item.id}  value={index}>{item.label}</MenuItem>
                  ))}
              
            </Select>
          </FormControl>
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


export default ParametricInformation;