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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ProcessRolesServices from '../../services/processServicesRoles'
import ParametricServices from '../../services/parametricvaluesService'


  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };


const RolesProcessTable=(props)=>{
  const [information, setInformation] = useState(props.information);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [listIndex, setListIndex] = useState(-1);
  const [listIndexSN, setListIndexSN] = useState(-1);
  const [cont, setCont] = useState(0);
  const [itemList, setItemList] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [list, setList] = useState([]);
  const [listSN, setListSN] = useState([{"id":"S","label":"S"},{"id":"N","label":"N"}]);
  
  const columns = [
    { id: 'roleName', label: 'Nombre del Rol', minWidth: 170 },
    { id: 'roleDescription', label: 'Descripción', minWidth: 170 },
    { id: 'initProcess', label: 'Inicia Proceso', minWidth: 170 },
    { id: 'delete', label: 'Eliminar', minWidth: 170 }
    
  ];
  
  const handleChangeList = (e) => {
    setListIndex(e.target.value);
    setItemList(list[e.target.value]);
  };
  const handleChangeListSN = (e) => {
    setListIndexSN(e.target.value);
  };
  const handleClick = (e) => {
    
    ProcessRolesServices.CreateProcessRoles({
                            "roleName":itemList.id, 
                            "roleDescription":itemList.label, 
                            "process":information.name,
                            "initProcess":listIndexSN
                            }).then(d=>{
                              setCont(cont+1);
                            });
    
  };
  const handleDelete = (item) => {
    ProcessRolesServices.DeleteProcessRoles({
                            "roleName":item.roleName, 
                            "process":information.name
                            }).then(d=>{
                              setCont(cont+1);
                            });
                            setCont(cont+1);
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  useEffect(() => {
    if(information!=null&&!!information.name)
    ProcessRolesServices.GetProcessesRoles({"process":information.process})
    .then(d=>{
      setRows(d);
    })    
    ParametricServices.GetParametric({"type":"ROL_PROCESO"}).then((data)=>{
      
      setList(data);
      data.map((row)=>{  
        setList(list =>[...list, {"id":row.name,"label":row.description}]);
        });
      });
      
    },[cont]);

  return (
    <div>
      <div>
      <FormControl >
        <InputLabel id="selectRole">Rol</InputLabel>
        <Select
          id="imple-select"
          value={listIndex}
          onChange={handleChangeList}
        >
          {list.map((item,index) => (
                <MenuItem key={item.id}  value={index}>{item.label}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <FormControl >
        <InputLabel id="selectRoleInit">Rol de Inicio</InputLabel>
        <Select
          id="imple-select2"
          value={listIndexSN}
          onChange={handleChangeListSN}
        >
          {listSN.map((item,index) => (
                <MenuItem key={item.id}  value={item.label}>{item.label}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleClick(e)}}>
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

export default RolesProcessTable;