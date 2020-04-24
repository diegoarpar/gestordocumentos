import React,{ useState,useEffect } from 'react';
import '../App.css';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


function FilesForm(props) {
    const onClick= props.onClick;
    return (
        <div className="FindDocumentsForm">
          <label>Cédula: </label>
          <Input></Input>
          <label>Código del documento: </label>
          <Input></Input>
          <Button variant="contained" color="primary" onClick={onClick}>Consultar documento: </Button>
        </div>
    );
  }


  function Files(props) {
    const onClick= props.onClick;
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Consultar documento
        </Button>
        <Dialog fullScreen open={open} onClose={handleClose} >
          <AppBar >
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                
              </IconButton>
              <Typography variant="h6" >
                Consultar documento
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Cerrar
              </Button>
            </Toolbar>
          </AppBar>
         
          <FilesForm  onClick={onClick}></FilesForm>
          
        </Dialog>
      </div>
    );
  }
export default Files;