import React,{ useState,useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useHandleInputChangeHook from '../../utils/useHandleInputChangeHook'

function FileSearchDisplay(props){
    const info = props.data;
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        table: {
            minWidth: 650,
        },
    }));
    const classes = useStyles();

    if(info === null || info === undefined){
        return (<div/>)
    }else {
        return (
            <Grid container alignItems={"center"} direction={"column"} spacing={2} xs={12}>
                <Grid item xs={12}>
                    <Paper elevation={5}>
                        <div>
                            <br/>
                        </div>
                        <Typography>Carpeta Única</Typography>
                        <Typography>{info.primerNombre + " " + info.segundoNombre + " " + info.primerApellido}</Typography>
                        <Typography>{info.tipoDocumento + " " + info.numeroDocumento}</Typography>
                        {info.expedientes.map((expediente) => (
                            <div className={classes.root}>
                                <ExpansionPanel>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography className={classes.heading}>Expediente:     {expediente.nombre}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <TableContainer component={Paper}>
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Nombre</TableCell>
                                                        <TableCell align="right">Tipo</TableCell>
                                                        <TableCell align="right">Digitalizado</TableCell>
                                                        <TableCell align="right">Ruta</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {expediente.documentos.map((documento) => (
                                                        <TableRow key={documento._id}>
                                                            <TableCell component="th" scope="row">
                                                                {documento.nombre}
                                                            </TableCell>
                                                            <TableCell align="right">{documento.tipo}</TableCell>
                                                            <TableCell align="right">{documento.digitalizado}</TableCell>
                                                            <TableCell align="right">{documento.rutaDigital}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

function FilesForm(props) {
    const [formData, setFormData] = useHandleInputChangeHook({});
    const [results,setResults] = useState(null);
    const onClick = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        };
        fetch('http://localhost:5000/carpetaDocumental/cliente', requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    setResults(data);
                    console.log("Respuesta Servicio " + data.primerNombre);
                }
            );
    };

    return (
        <div>
            <Grid container alignItems={"center"} direction={"column"} spacing={2}>
               <Grid item>
               </Grid>
                <Grid item xs={12}>
                   <Grid container justify={"center"} alignItems={"center"} spacing={2}>
                        <Grid xs={6} item>
                            <TextField label="Código Documento" name={"tipoDocumento"} variant="outlined" onChange={setFormData}/>
                        </Grid>
                       <Grid xs={6} item>
                           <TextField label="Número Documento" name={"numeroDocumento"} variant="outlined" onChange={setFormData}/>
                       </Grid>
                   </Grid>
               </Grid>
                <Grid xs={12} item>
                    <Button variant="contained" color="primary" onClick={onClick}>
                        <ArrowForwardIos/>
                    </Button>
                </Grid>
            </Grid>
            <FileSearchDisplay data={results}/>
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
                        Consultar Documento
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