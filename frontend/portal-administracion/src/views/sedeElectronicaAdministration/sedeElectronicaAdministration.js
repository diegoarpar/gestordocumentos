import React,{ useState,useEffect } from 'react';
import TabNavigatorSedeElectronicaConfiguration from './tabNavigatorSedeElectronica';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";

const SedeElectronicaAdministration =()=>{
    const [open,setOpen]=useState(false);
    return (
        <div>
        <Button variant="contained" simple="true" color="inherit"
                onClick={(e)=>setOpen(true)}
        >
            Administrar Sede Electrónica
        </Button>
            <Dialog fullScreen open={open}  >
                <AppBar position="static">

                    <IconButton edge="start" color="inherit" onClick={(e)=>setOpen(false)} aria-label="close">
                        <ArrowBack  />
                        <Typography variant="h6" >
                            Sede Electrónica
                        </Typography>
                    </IconButton>

                </AppBar>
                <TabNavigatorSedeElectronicaConfiguration></TabNavigatorSedeElectronicaConfiguration>
            </Dialog>
        </div>
    );
}

export default SedeElectronicaAdministration;