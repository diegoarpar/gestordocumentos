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
import Modal from '@material-ui/core/Modal';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Password from "@material-ui/icons/VpnKey";
import People from "@material-ui/icons/People";
import SHA256 from 'js-sha256';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import UsersServices from '../../services/userServices'
import UserInformation from './userInformation'






  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };


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

export default RolesTable;