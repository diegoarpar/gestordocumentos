import React,{ useState,useEffect } from 'react';
import dynamic from "next/dynamic";
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

    const FileViewer = dynamic(
            () => import("react-file-viewer").then((mod) => mod.Form),
            { ssr: false }
            );
    
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