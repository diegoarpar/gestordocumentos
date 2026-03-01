import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

const ShowProcessModelInstance =(props)=>{
    const file=props.file;
    const fileType=props.fileType;
    const open=props.open;
    const handleClose=props.handleClose;

    return (
    <div>
        <Dialog fullScreen open={open} onClose={()=>handleClose(false)} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={()=>handleClose(false)} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Estado de la tarea
              </Typography>
            </Toolbar>
          </AppBar>
            <Viewer file={file} fileType={fileType}/>
          </Dialog>
    </div>
    );
}

const Viewer =(props)=>{
    const file=props.file;
    return (
    <div className="custom-viewer">
        <img src={`data:image/png;base64,${file}`} style={{maxWidth:'100%', height:'auto'}} alt="Proceso" />
    </div>
    );
}

export default {ShowProcessModelInstance, Viewer};