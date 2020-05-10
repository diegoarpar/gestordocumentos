import React,{ useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Password from "@material-ui/icons/VpnKey";
import People from "@material-ui/icons/People";
 const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  


const UserInformation=(props)=>{
  
  const [userName, setUserName] = useState(props.rowInformation.user);
  const [userId, setUserId] = useState(props.rowInformation._id);
  const [password, setPassword] = useState(props.rowInformation.password);
  const [documentType, setDocumentType] = useState(props.rowInformation.documentType);
  const [documentNumber, setDocumentNumber] = useState(props.rowInformation.documentNumber);
  const [email, setEmail] = useState(props.rowInformation.email);
  const [name, setName] = useState(props.rowInformation.name);
  const [lastName, setLastName] = useState(props.rowInformation.lastName);
  const [modalType, setModalType] = useState(props.modalType);
  const classes = useStyles;
  const handleClick=props.handleClick;
  const handleClose=props.onClose;

  return (<div>
          <CustomInput
            labelText="Nombre ..."
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
            labelText="Apellido..."
            id="setLastName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:lastName,
              onChange: (e) => {setLastName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Nombre de Usuario..."
            id="setUserName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:userName,
              onChange: (e) => {setUserName(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />

          <CustomInput
            labelText="Contraseña..."
            id="setPassword"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "password",
              defaultValue:password,
              onChange: (e) => {setPassword(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <Password className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
           <CustomInput
            labelText="Tipo de documento..."
            id="setDocumentType"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:documentType,
              onChange: (e) => {setDocumentType(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Número de documento..."
            id="setDocumentNumber"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:documentNumber,
              onChange: (e) => {setDocumentNumber(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <CustomInput
            labelText="Correo Electrónico..."
            id="setEmail"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:email,
              onChange: (e) => {setEmail(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          {modalType=="C"&&<Button variant="contained" color="primary"  
            onClick={(e) => {
              handleClick(e,{"user":userName,
                            "password":password,
                            "name":name,
                            "lastName":lastName,
                            "documentType":documentType,
                            "documentNumber":documentNumber,
                            "email":email
                            },"C");
              
              }}>
                            Agregar
          </Button>
          }
          {modalType=="M"&&<Button variant="contained" color="primary"  
            onClick={(e) => {
              handleClick(e,{"user":userName,
                            "password":password,
                            "name":name,
                            "lastName":lastName,
                            "documentType":documentType,
                            "documentNumber":documentNumber,
                            "email":email,
                            "_id":userId
                            },"M");
              
              }}>
                            Guardar Cambios
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


export default UserInformation;