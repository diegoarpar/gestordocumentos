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
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProcessServices from '../../services/processServices'
import ProcessInformation from './processInformation'
import Modal from '@material-ui/core/Modal';
import ProcessRolesServices from '../../services/processServicesRoles'
import a11yProps from "../../utils/a11yProps";
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ProcessForm from "./processForm";

  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

  
const ProcessAdministrationTable=(props)=>{
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [processInformation, setProcessInformation] = useState();
  const [modalType, setModalType] = useState();
  const [cont, setCont] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open2, setOpen] = useState(false);
  const handleRowInformation=props.handleRowInformation;
  const columns = [
    { id: 'name', label: 'Nombre del Rol', minWidth: 170 },
    { id: 'description', label: 'Descripción', minWidth: 170 },
    { id: 'isAnonymouseRequest', label: 'Es Anónimo', minWidth: 170 },
    { id: 'delete', label: 'Opciones', minWidth: 170 }
    
  ];
  const handleModifyForm=(row)=>{
    handleRowInformation(row);
  }
  const handleClose = () => {
    setOpen(false);
    };
    const handleModalOC = (value) => {
      setOpen(value);
      };  
  const handleModal = (row,modalType) => {
    setProcessInformation(row); 
    setModalType(modalType)
    setOpen(true);
    }; 
  const handleCreate = (e,item,modalType) => {
    var newData={
      "name":item.name, 
      "description":item.description, 
      "workflowName":item.workflowName,
      "isAnonymouseRequest":item.isAnonymouseRequest,
      "isPortalFuncionarioRequest":item.isPortalFuncionarioRequest,
      "isSedeElectronicaRequest":item.isSedeElectronicaRequest
    };
    if(modalType=="C"){
      ProcessServices.CreateProcess(newData).then(()=>{setCont(cont+1);});
    
    }else if(modalType=="M"){
      delete newData.name;
      ProcessServices.UpdateProcess(
        {
          "new":newData,
          "query":{"name":processInformation.name}
        }).then(()=>{setCont(cont+1);});
    }
    
  };
  const handleDelete = (row) => {
    ProcessRolesServices.DeleteProcessRoles({"process":row.name});
    ProcessServices.DeleteProcess({"name":row.name 
                             }).then(()=>{setCont(cont+1);});
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  useEffect(() => {
    
    ProcessServices.GetProcesses({})
    .then(d=>{
      setRows(d);
    })    
    
    },[cont]);

  return (
    <div>
      <div>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleModal({},"C")}}>
                            Crear trámite
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if(column.id!="delete"&&column.id!="modify"){
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
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleModal(row,"M")}}>
                              Modificar
                            </Button>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleModifyForm(row);}}>
                              Modificar Formulario
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

    <Dialog fullScreen open={open2} onClose={handleClose} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Información del trámite
              </Typography>
            </Toolbar>
          </AppBar>
          <ProcessInformation information={processInformation} 
                                    modalType={modalType} 
                                    handleClick={handleCreate} 
                                    handleClose={handleClose}
                                    handleModalOC={handleModalOC}
                                    /> 
        </Dialog>

    
    </div>
  );
}

export default ProcessAdministrationTable;