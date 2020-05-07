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
import SHA256 from 'js-sha256';
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';






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
    const [rowInformation, setRowInformation] = React.useState();
    const [newUser, setNewUser] = React.useState();
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
    const handleOpen = (e,type,row) => {
        setRowInformation(row);
        setModalType(type);
        setOpen(true);
      };
    const handleClose = () => {
    setOpen(false);
    }; 
    
    const handleCreateUser = (e,data,type) => {
      let dataPost={
          "user":data.user,
          "password":SHA256(data.password),
          "documentType":data.documentType,
          "documentNumber":data.documentNumber,
          "name":data.name,
          "lastName":data.lastName,
          "email":data.email
      };
      if(type=='C'){
        UsersServices.CreateUser(dataPost);
        setNewUser(dataPost);
      }else if (type=='M'){
        dataPost.password=rowInformation.password;
        UsersServices.UpdateUser({
                        "userQuery":{"user":dataPost.user,"_id":dataPost._id},
                        "userNewData":dataPost
                        });
        setNewUser(dataPost);
      }
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
        
        },[newUser]);
    

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
                  key={column.id}
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
                        <TableCell  align={column.align} key={column.id}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                        );
                    }else if(column.id=="modifyInfo"){
                        return (
                        <TableCell  align={column.align} key={column.id}>
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
            <h2 id="modalTitle">Información del usuario</h2>
            
            <TabsContainer rowInformation={rowInformation} 
                                    modalType={modalType} 
                                    handleCreateUser={handleCreateUser} 
                                    handleClose={handleClose}/>
        </div>
    </Modal>
    </div>
      );

}

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

const RolesTable=(props)=>{
  const [userInformation, setUserInformation] = useState(props.userInformation);
  const [rows, setUserRoles] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rol, setRol] = React.useState(-1);
  const [contRoles, setContRoles] = React.useState(0);
  const [rolItem, setRolItem] = React.useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const columns = [
    { id: 'roleName', label: 'Nombre del Rol', minWidth: 170 },
    { id: 'roleDescription', label: 'Descripción', minWidth: 170 },
    { id: 'delete', label: 'Eliminar', minWidth: 170 }
    
  ];
  const roleList = [
    { id: 'administrador', label: 'Administrador', minWidth: 170 },
    { id: 'ciudadano', label: 'Ciudadano', minWidth: 170 },
    { id: 'archivo', label: 'Archivo', minWidth: 170 },
    { id: 'ventanilla', label: 'Ventanilla', minWidth: 170 },
    { id: 'gestordecasos', label: 'Gestor de Casos', minWidth: 170 }
  ];
  const handleChangeList = (e) => {
    setRol(e.target.value);
    setRolItem(roleList[e.target.value]);
  };
  const handleCreateRol = (e) => {
    UsersServices.SaveRoles({"roleName":rolItem.id, 
                            "roleDescription":rolItem.label, 
                             "user":userInformation.user});
    setContRoles(contRoles+1);
  };
  const handleDelete = (rolItem) => {
    debugger;
    UsersServices.DeleteRoles({"roleName":rolItem.roleName, 
                            "roleDescription":rolItem.roleDescription, 
                             "user":userInformation.user});
    setContRoles(contRoles+1);
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  useEffect(() => {
    if(userInformation!=null&&!!userInformation.user)
    UsersServices.GetRoles({"user":userInformation.user})
    .then(d=>{
      setUserRoles(d);
    })    
    
    },[contRoles]);

  return (
    <div>
      <div>
      <FormControl >
        <InputLabel id="selectRole">Rol</InputLabel>
        <Select
          id="imple-select"
          value={rol}
          onChange={handleChangeList}
        >
          {roleList.map((item,index) => (
                <MenuItem key={item.id}  value={index}>{item.label}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleCreateRol(e)}}>
                            Agregar Rol
                            </Button>
      </div>
      <Paper >
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.roleName}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if(column.id!="delete"){
                        return (
                        <TableCell  align={column.align} key={column.id}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                        );
                    }else if (column.id=="delete"){
                      return (
                        <TableCell  align={column.align} key={column.id}>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleDelete(row)}}>
                              Eliminar
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
    </div>
  );
}

const PortalTable=(props)=>{
  const [userInformation, setUserInformation] = useState(props.userInformation);
  const [rows, setUserPortals] = useState([]);
  const [page, setPage] = React.useState(0);
  const [portal, setPortal] = React.useState();
  const [portalItem, setPortalItem] = React.useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [countPortal, setCountPortal] = React.useState(0);
  const columns = [
    { id: 'portalName', label: 'Nombre del Rol', minWidth: 170 },
    { id: 'portalDescription', label: 'Descripción', minWidth: 170 },
    { id: 'delete', label: 'Eliminar', minWidth: 170 }
    
  ];
  const portalList = [
    { id: 'sedeElectronica', label: 'Sede Electrónica', minWidth: 170 },
    { id: 'ventanillaUnica', label: 'Ventanilla Única', minWidth: 170 },
    { id: 'archivo', label: 'Archivo', minWidth: 170 },
    { id: 'administracion', label: 'Administración', minWidth: 170 },
    { id: 'gestordecasos', label: 'Gestor de Casos', minWidth: 170 }
  ];

  const handleChangeList = (e) => {
    setPortal(e.target.value);
    setPortalItem(portalList[e.target.value]);
  };
  const handleCreatePortal = (e) => {
    UsersServices.SavePortals({"portalName":portalItem.id, 
                            "portalDescription":portalItem.label, 
                             "user":userInformation.user});
    setCountPortal(countPortal+1);
  };
  const handleDeletePortal = (portalItem) => {
    debugger;
    UsersServices.DeletePortals({"portalName":portalItem.portalName, 
                            "portalDescription":portalItem.portalDescription, 
                             "user":userInformation.user});
    setCountPortal(countPortal+1);
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  useEffect(() => {
    if(userInformation!=null&&!!userInformation.user)
    UsersServices.GetPortals({"user":userInformation.user})
    .then(d=>{
      setUserPortals(d);
    })    
    
    },[countPortal]);

  return (
    <div>
      <div>
      <FormControl >
        <InputLabel id="selectRole">Portal</InputLabel>
        <Select
          id="imple-select"
          value={portal}
          onChange={handleChangeList}
        >
          {portalList.map((item,index) => (
                <MenuItem key={item.id}  value={index}>{item.label}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleCreatePortal(e)}}>
                            Agregar Rol
                            </Button>
      </div>
      <Paper >
      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
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
                    if(column.id!="delete"){
                        return (
                        <TableCell  align={column.align} key={column.id}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                        );
                    }else if (column.id=="delete"){
                      return (
                        <TableCell  align={column.align} key={column.id}>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleDeletePortal(row)}}>
                              Eliminar
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
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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
const TabsContainer =(props)=>{
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
              <Tab label="Datos Básicos" {...a11yProps(0)} />
              <Tab label="Roles" {...a11yProps(1)} />
              <Tab label="Acceso a Portales" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <div>
                  <UserInformation rowInformation={rowInformation} 
                                    modalType={modalType} 
                                    handleClick={handleCreateUser} 
                                    onClose={handleClose}/>
                    </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
                <RolesTable userInformation={rowInformation}>  </RolesTable>
          </TabPanel>
          <TabPanel value={value} index={2}>
              <PortalTable userInformation={rowInformation}>  </PortalTable>
          </TabPanel>
          
          </div>
      );
  }
export default UserAdministration;