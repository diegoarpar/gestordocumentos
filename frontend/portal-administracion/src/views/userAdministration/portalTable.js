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
import RolesTable from './rolesTable'





  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  





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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.portalName}>
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


export default PortalTable;