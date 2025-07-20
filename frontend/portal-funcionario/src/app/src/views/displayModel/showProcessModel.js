import React,{ useState,useEffect } from 'react';
import FileViewer from 'react-file-viewer';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';

const ShowProcessModelInstance =(props)=>{
    const file=props.file;
    const fileType=props.fileType;
    const open=props.open;
    const handleClose=props.handleClose;
    
    return (
    <div>
        <Dialog fullScreen open={open} onClose={(e)=>handleClose(false)} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={(e)=>handleClose(false)} aria-label="close">
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
    const fileType=props.fileType;
    return (
    <div  className="custom-viewer">
        <FileViewer
        fileType={fileType}
        filePath={`data:image/png;base64,${file}`}/>
    </div>
    );
}

export default {ShowProcessModelInstance, Viewer};