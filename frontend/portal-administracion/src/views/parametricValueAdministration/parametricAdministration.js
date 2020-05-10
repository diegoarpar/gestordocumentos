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
import ParametricServices from '../../services/parametricvaluesService'
import ParametricInformation from './parametricInformation'
import Modal from '@material-ui/core/Modal';

  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

  

  
const ParametricAdministrationTable=(props)=>{
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [information, setInformation] = useState();
  const [modalType, setModalType] = useState();
  const [cont, setCont] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const columns = [
    { id: 'name', label: 'Nombre del Rol', minWidth: 170 },
    { id: 'description', label: 'Descripción', minWidth: 170 },
    { id: 'typeDescription', label: 'Tipo', minWidth: 170 },
    { id: 'modify', label: 'Modificar', minWidth: 170 },
    { id: 'delete', label: 'Eliminar', minWidth: 170 }
    
  ];
  const handleClose = () => {
    setOpen(false);
    }; 
  const handleModal = (row,modalType) => {
    setInformation(row); 
    setModalType(modalType)
    setOpen(true);
    }; 
  const handleCreate = (e,item,modalType) => {
    var newData={
      "name":item.name, 
      "description":item.description, 
      "type":item.type,
      "typeDescription":item.typeDescription,
      "value":item.value
    };
    if(modalType=="C"){
      ParametricServices.CreateParametric(newData).then(()=>{setCont(cont+1);});
    
    }else if(modalType=="M"){
      
      ParametricServices.UpdateParametric(
        {
          "new":newData,
          "query":{
            "name":information.name,
            "type":information.type
          }
        }).then(()=>{setCont(cont+1);});
    }
    setCont(cont+1);
  };
  const handleDelete = (row) => {
    ParametricServices.DeleteParametric({
      "name":row.name,
      "type":row.type 
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
    
    ParametricServices.GetParametric({})
    .then(d=>{
      setRows(d);
    })    
    
    },[cont]);

  return (
    <div>
      <div>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleModal({},"C")}}>
                            Crear paramétrica
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
                        </TableCell>
                        );
                    }else if (column.id=="modify"){
                      return (
                        <TableCell  align={column.align} key={column.id}>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleModal(row,"M")}}>
                              Modificar
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
            <h2 id="modalTitle">Información de la paramétrica</h2>
            
            <ParametricInformation information={information} 
                                    modalType={modalType} 
                                    handleClick={handleCreate} 
                                    handleClose={handleClose}
                                    />
        </div>
    </Modal>
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
const ParametricAdministration =(props)=>{
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
              <Tab label="Trámites" {...a11yProps(0)} />
              <Tab label="" {...a11yProps(1)} />
              <Tab label="" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                  <div>
                  <ParametricAdministrationTable/>
                    </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
                
          </TabPanel>
          <TabPanel value={value} index={2}>
              
          </TabPanel>
          
          </div>
      );
  }
export default ParametricAdministration;