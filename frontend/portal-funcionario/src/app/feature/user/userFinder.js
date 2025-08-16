import React,{ useState,useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import CustomInput from "@/app/components/CustomInput/CustomInput.js";
import InputAdornment from "@mui/material/InputAdornment";
import People from "@mui/icons-material/People";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ParametricServices from '@/app/api/parametricServices';
import UserServices from '@/app/api/userServices';
import UsersInformation from './usersInformation';

const UserFinder=(props)=>{
  
  const [modalType, setModalType]= useState();
  const [open, setOpen]= useState(false);
  const [user, setUser]= useState({});
  const setCitizen2=props.setCitizen;
  const setCitizen=(row)=>{
    setOpen(false);
    setCitizen2(row);
  }
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
    
    {<Button
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
                Consultar Ciudadano
              </Typography>
            </Toolbar>
          </AppBar>
          <UserFindForm 
              handleClick={handleClickSaveModal} 
              onClose ={handleCloseModal} 
              rowInformation={user}
              modalType={modalType}
              setCitizen={setCitizen}
          >
          </UserFindForm>  
        </Dialog>
  </div>);
}

const UserFindForm =(props)=>{
  const setCitizen=props.setCitizen;
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
      {<Button
      variant="outlined" 
      color="inherit" 
      aria-controls="customized-menu"
      aria-haspopup="true"
      onClick={handleAddField}>
          Agregar Campo
        </Button>
        }
         {<Button
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
      <UsersInformation rows={rowsUser} setCitizen={setCitizen}/>
    </div>);
}
export default UserFinder;