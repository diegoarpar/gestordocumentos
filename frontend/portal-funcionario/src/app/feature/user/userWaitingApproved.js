import React,{ useState,useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

import UsersServices from '@/app/api/userServices'
import UserInformation from './userInformation';


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
    <Dialog fullScreen open={open}  >
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

  const [openUserWaiting, setOpenUserWaiting]=useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
      <div>
          <Button variant="contained" color="inherit"  onClick={(e)=>setOpenUserWaiting(true)} >
              Usuarios por aprobar
          </Button>
          <Dialog fullScreen open={openUserWaiting}  >
          <AppBar position="static">
              <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={(e)=>setOpenUserWaiting(false)} aria-label="close">
                      <ArrowBack />
                  </IconButton>
                  <Typography variant="h6" >
                      Opciones sobre los usuarios
                  </Typography>
              </Toolbar>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Usuarios Pendientes" {...a11yProps(0)} />
              
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
                <UserWaitingApprovedTab/>
          </TabPanel>
          </Dialog>
          </div>
      );
  }
export default UserWaitingApproved;