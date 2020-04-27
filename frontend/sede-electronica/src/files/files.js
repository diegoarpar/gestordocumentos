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
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import useHandleInputChangeHook from '../utils/useHandleInputChangeHook'

function FileSearchDisplay(props){
    const queryData = props.queryData;
    const [results, setResults] = useState(null);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props.queryData)
    };
    fetch('http://localhost:5000/authentication/validateuser/', requestOptions)
        .then(response => response.json())
        .then(
            data => {
                setResults(data);
                console.log("Respuesta Servicio " + results);
            }
        );
    if(props.search && results){
        return(<div/>);
    }else{
        return(<div/>);
    }

}

function FilesForm(props) {
    const [formData, setFormData] = useHandleInputChangeHook({});
    const [doSearch,setDoSearch] = useState(false);
    const onClick = (e) => {
        alert("codigo: " +formData.codDocumento + " Numero" + formData.numeroDocumento);
    };

    return (
        <div>
            <Grid container alignItems={"center"} direction={"column"} spacing={2} >
               <Grid item>
               </Grid>
                <Grid item xs={12}>
                   <Grid container justify={"center"} alignItems={"center"} spacing={2}>
                        <Grid xs={6} item>
                            <TextField label="Código Documento" name={"codDocumento"} variant="outlined" onChange={setFormData}/>
                        </Grid>
                       <Grid xs={6} item>
                           <TextField label="Número Documento" name={"numeroDocumento"} variant="outlined" onChange={setFormData}/>
                       </Grid>
                   </Grid>
               </Grid>
                <Grid xs={12} item alignContent={"center"} direction={"column"}>
                    <Button variant="contained" color="primary" onClick={onClick}>
                        <ArrowForwardIos/>
                    </Button>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item>
                    <FileSearchDisplay queryData={formData} search={doSearch}/>
                </Grid>
            </Grid>
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
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6">
                        Consultar documento
                    </Typography>
                </Toolbar>
            </AppBar>
            <div>
                <FilesForm onClick={onClick}></FilesForm>
            </div>
        </Dialog>
      </div>
    );
}
export default Files;