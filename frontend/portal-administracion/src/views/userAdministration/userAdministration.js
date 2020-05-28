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
import UsersServices from '../../services/userServices'
import UserInformation from './userInformation'
import RolesTable from './rolesTable'
import PortalTable from './portalTable'
import RolesProcessTable from './rolesProcessTable'
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Toolbar from "@material-ui/core/Toolbar";




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
    const [openDialog, setOpenDialog] = React.useState(false);
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
          "email":data.email,
          "isCitizen":data.isCitizen,
          "isFunctionary":data.isFunctionary,
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
      const handleActiveUser=(row)=>{
        var active="S";
        if(row.active=="S"){
          active="N";
        }
        UsersServices.UpdateUser({
          "userQuery":{"user":row.user},
          "userNewData":{"active":active}
          })
          .then((data)=>{
            setNewUser(data);
          });
      }
      
    useEffect(() => {
        UsersServices.GetData()
        .then(d=>{
            setUsers(d);
        })    
        
        },[newUser]);
    

    return (
    <div>
        <Button variant="contained" simple="true" color="inherit"
                onClick={(e)=>setOpenDialog(true)}
        >
            Administración de usuarios
        </Button>
        <Dialog fullScreen open={openDialog} onClose={(e)=>setOpenDialog(false)} >
            <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={(e)=>setOpenDialog(false)} aria-label="close">
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" >
                    Modificar Información
                </Typography>
            </Toolbar>
            </AppBar>
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
                            <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleActiveUser(row)}}>
                              {row.active=="S"?"Inactivar":"Activar"}
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
    </Dialog>
    <Dialog
        open={open}

        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        fullScreen
    >
        <AppBar  position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={(e)=>setOpen(false)} aria-label="close">
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" >
                    Modificar Información Usuario
                </Typography>
            </Toolbar>
        </AppBar>


            <TabsContainer rowInformation={rowInformation} 
                                    modalType={modalType} 
                                    handleCreateUser={handleCreateUser} 
                                    handleClose={handleClose}/>

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
                  <Tab label="Roles en procesos" {...a11yProps(3)} />
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
              <TabPanel value={value} index={3}>
                  <RolesProcessTable userInformation={rowInformation}>  </RolesProcessTable>
              </TabPanel>


          </div>
      );
  }
export default UserAdministration;