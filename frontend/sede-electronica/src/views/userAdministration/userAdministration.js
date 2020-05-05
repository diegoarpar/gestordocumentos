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

    const handleOpen = () => {
        setOpen(true);
      };
    const handleClose = () => {
    setOpen(false);
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
        <Button variant="contained" color="primary"  onClick={(e) => {handleOpen(e)}}>
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
                            <Button variant="contained" simple="true" color="primary"  onClick={(e) => {handleOpen(e)}}>
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
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
            
        </div>
    </Modal>
    </div>
      );

}

export default UserAdministration;