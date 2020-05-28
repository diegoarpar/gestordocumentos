import React,{ useState,useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ParametricServices from '../../services/parametricServices';
import UserServices from '../../services/userServices';
import UsersInformation from './usersInformation';

const UserFinder=(props)=>{
  
  const [modalType, setModalType]= useState();
  const [open, setOpen]= useState(false);
  const [user, setUser]= useState({});
  
  const handleCloseModal = ()=>{
    setOpen(false);
    
  }
  const handleOpenModal = (modalType)=>{
    setOpen(true);
  }
  useEffect(()=>{
    
  },[]);
  const handleClickSaveModal=(e,data)=>{
    
  }

  return (
  <div>
    
    {true&&<Button 
      variant="contained"
      aria-controls="customized-menu"
      aria-haspopup="true"
      onClick={(e)=>handleOpenModal("C")}>
          Buscar Ciudadano
        </Button>
        }
    <Dialog fullScreen open={open}  >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                {modalType=="M"?"Actualizar Datos":"Registrar Usuario"}
              </Typography>
            </Toolbar>
          </AppBar>
          <UserFindForm 
              handleClick={handleClickSaveModal} 
              onClose ={handleCloseModal} 
              rowInformation={user}
              modalType={modalType}>
          </UserFindForm>  
        </Dialog>
  </div>);
}

const UserFindForm =(props)=>{
  const [name, setName] = useState();
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [rowsUser, setRowsUser] = useState([]);
  const [listIndex, setListIndex] = useState(-1);
  const [itemList, setItemList] = useState();
  const handleAddField=()=>{
    
    if(!!itemList)setRows2(rows2=>[...rows2,itemList]);
    
  }
  const handleChangeList=(idx)=>{
    setListIndex(idx.target.value);
    setItemList(rows[idx.target.value]);
  }
  const handleFind=()=>{
    var userToFind={};
    rows2.map((row)=>{
      userToFind[row.search.field]=row.search.value;
    });
    UserServices.GetUser(userToFind)
    .then((data)=>{
      setRowsUser(data);
    });
  }
  const setValueFieldList=(value, idx)=>{
    rows2[idx].search=value;
  }
  useEffect(()=>{
    ParametricServices.GetParametric({"type":"DATOS_BUSQUEDA_VENTANILLA_CIUDADANO"})
    .then((data)=>{
      setRows(data);
    });
  },[]);
  return (
    <div>
      <FormControl >
        <InputLabel id="type">Tipo</InputLabel>
        <Select
          id="simple-select"
          value={listIndex}
          onChange={handleChangeList}
        >
          {rows.map((item,index) => (
                <MenuItem key={item.name}  value={index}>{item.description}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      {true&&<Button 
      variant="outlined" 
      color="inherit" 
      aria-controls="customized-menu"
      aria-haspopup="true"
      onClick={handleAddField}>
          Agregar Campo
        </Button>
        }
         {true&&<Button 
          variant="outlined" 
          color="inherit" 
          aria-controls="customized-menu"
          aria-haspopup="true"
          onClick={handleFind}>
          Buscar
        </Button>
        }
      <List  subheader={<li />}>
        {!!rows2&&!!rows2.map&&rows2.map((row, idx) => (
          <li key={`section-${row.name}`} >
            <ul >
                <ListItem key={`item-${row.name}-`}>
                  
                    <CustomInput
                        labelText={row.description+" ..."}
                        id={row.description+" ..."}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          onChange: (e) => {setValueFieldList({"value":e.target.value, "field":row.value},idx)},
                          endAdornment: (
                            <InputAdornment position="end">
                              <People  />
                            </InputAdornment>
                          )
                        }
                      }
                      />
                </ListItem>
              
            </ul>
          </li>
        ))}
      </List>
      <UsersInformation rows={rowsUser}/>
    </div>);
}
export default UserFinder;