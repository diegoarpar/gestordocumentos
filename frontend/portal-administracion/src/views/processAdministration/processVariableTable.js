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
import People from "@material-ui/icons/People"
import classes from "../../utils/useStyles";
import ProcessVariableServices from "../../services/processVariableServices";
import ProcessActivityServices from "../../services/processActivityServices";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const ProcessVariableTable=(props)=>{
  const information =props.information;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [cont, setCont] = useState(0);
  const [itemList, setItemList] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [list, setList] = useState([]);
  const [listIndex, setListIndex] = useState(-1);
  const [listSN, setListSN] = useState([{"id":"S","label":"S"},{"id":"N","label":"N"}]);
  
  const columns = [
    { id: 'name', label: 'Nombre', minWidth: 170 },
    { id: 'description', label: 'Descripción', minWidth: 170 },
    { id: 'activityName', label: 'Actividad', minWidth: 170 },
    { id: 'delete', label: 'Eliminar', minWidth: 170 }
    
  ];
  const handleChangeList = (e) => {
    setListIndex(e.target.value);
    setItemList(list[e.target.value]);
  };
  const handleClick = (e) => {
    ProcessVariableServices.CreateProcessVariable(
      {
        "processName":information.name,
        "name":name,
        "description":description,
        "activityName":itemList.name
       })
      .then((data)=>{setCont(cont+1)});
  };
  const handleDelete = (item) => {
    ProcessVariableServices.DeleteProcessVariable({"processName":information.name,"name":item.name})
    .then((data)=>{setCont(cont+1)});
  };

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  useEffect(() => {
    if(information!=null&&!!information.name){
      ProcessVariableServices.GetProcessesVariable({"processName":information.name})
      .then((data)=>{setRows(data)});
    }
    ProcessActivityServices.GetProcessesActivity({"processName":information.name})
    .then((data)=>{
      setList(data);
    })

    },[cont]);

  return (
    <div>
      <div>
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
            labelText="Descripcion ..."
            id="setDescription"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              defaultValue:description,
              onChange: (e) => {setDescription(e.target.value)},
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }
          }
          />
          <FormControl >
        <InputLabel id="selectActivity">Actividad</InputLabel>
        <Select
          id="imple-select"
          value={listIndex}
          onChange={handleChangeList}
        >
          {list.map((item,index) => (
                <MenuItem key={item.id}  value={index}>{item.name}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <Button variant="contained" simple="true" color="primary"  
                            onClick={(e) => {handleClick(e)}}>
                            Agregar Variable
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

export default ProcessVariableTable;