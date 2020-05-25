import React,{ useState,useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import SHA256 from 'js-sha256';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

import UsersServices from '../../services/userServices'
import UserInformation from '../user/userInformation';


function UserWaitingApprovedTab(props) {
    const [rows,setRows]  = useState([]);
    const [row,setRow]  = useState({});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState();
    
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
        setRow(row);
        setModalType(type);
        setOpen(true);
      };
    const handleClose = () => {
    setOpen(false);
    }; 
    
    const handleActivateUser = (row) => {
      
      UsersServices.UpdateUser({
        "userQuery":{"user":row.user},
        "userNewData":{"active":"S"}
        })
        .then((data)=>{
          setNewUser(data);
        });
      

    }
    
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    }
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }
      
    useEffect(() => {
        UsersServices.GetUser({"enrollingType":"with_manual_checked","active":{$ne:"S"}})
        .then((data)=>{
          setRows(data);
        });
    },[newUser]);
    

    return (
    <div>
      <Paper >
      <TableContainer>
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
                            onClick={(e) => {handleOpen(e,"R",row)}}>
                            Detalle
                            </Button>
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleActivateUser(row)}}>
                            Activar
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
    <Dialog fullScreen open={open} onClose={handleClose} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Detalle
              </Typography>
            </Toolbar>
          </AppBar>
            <UserInformation modalType={modalType} rowInformation={row}/>

          </Dialog>
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
const UserWaitingApproved =(props)=>{
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
              <Tab label="Usuarios Pendientes" {...a11yProps(0)} />
              
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                <UserWaitingApprovedTab/>
          </TabPanel>
          </div>
      );
  }
export default UserWaitingApproved;