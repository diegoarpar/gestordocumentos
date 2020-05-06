import React,{ useState,useEffect } from 'react';
import UsersServices from '../../services/userServices'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Password from "@material-ui/icons/VpnKey";
import People from "@material-ui/icons/People";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";




const columns = [
    { id: 'user', label: 'Usuario', minWidth: 170 },
    { id: 'email', label: 'Correo', minWidth: 100 },
    {
      id: 'modifyInfo',
      label: 'Modificar Información',
      minWidth: 170,
      align: 'right'
      
    }
  ];

  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }
  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  


function UserAdministration(props) {
    const [rows,setUsers]  = useState([]);
    const classes = useStyles;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState();

    const handleOpen = (e,type,row) => {
      console.log(row);
         setModalType(type);
        setOpen(true);
      };
    const handleClose = () => {
    setOpen(false);
    }; 
    
    const handleCreateUser = (e,data,type) => {
      alert();
      };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
      
    useEffect(() => {
        UsersServices.GetData()
        .then(d=>{
            setUsers(d);
        })    
        
        },[]);

    return (
    <div>
        <Button variant="contained" color="primary"  onClick={(e) => {handleOpen(e,"C",{})}}>
                            Nuevo Usuario
                            </Button>
      <Paper >
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.user}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if(column.id!="modifyInfo"){
                        return (
                        <TableCell  align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                        );
                    }else if(column.id=="modifyInfo"){
                        return (
                        <TableCell  align={column.align}>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleOpen(e,"M",row)}}>
                            Ver Detalles
                            </Button>
                            
                        </TableCell>
                        );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        
    >
        <div className="modalClass">
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
            <UserInformation modalType={modalType} handleClick={handleCreateUser} onClose={handleClose}/>
        </div>
    </Modal>
    </div>
      );

}

const UserInformation=(props)=>{
  
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [documentType, setDocumentType] = useState();
  const [documentNumber, setDocumentNumber] = useState();
  const [email, setEmail] = useState();
  const [modalType, setModalType] = useState(props.modalType);
  const classes = useStyles;
  const handleClick=props.handleClick;
  const handleClose=props.onClose;

  return (<div>
          <CustomInput
            labelText="Nombre de Usuario..."
            id="setUserName"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
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
              handleClick(e,{"userName":userName,
                            "password":password,
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
              handleClick(e,{"userName":userName,
                            "password":password,
                            "documentType":documentType,
                            "documentNumber":documentNumber,
                            "email":email
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

export default UserAdministration;