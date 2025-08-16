import React,{ useState,useEffect } from 'react';
import dynamic from "next/dynamic";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import FileManager from '@/app/api/fileManagementServices';
const ShowFile =(props)=>{
  const FileViewer = dynamic(
            () => import("react-file-viewer").then((mod) => mod.Form),
            { ssr: false }
            );  
  const [file, setFile]=useState();
    const fileType=props.row.tipo;
    const numeroRadicado=props.numeroRadicado;
    const open=props.open;
    const setOpen=props.setOpen;
    const row=props.row;
    const handleClose=props.handleClose;
    useEffect(()=>{
        let filter={"nombre":row.nombre, "numeroRadicado":numeroRadicado};
        FileManager.consultarArchivo(filter)
            .then((data)=>{
                setFile(data);
            });
    });
    return (
    <div>
        <Dialog fullScreen open={open} onClose={(e)=>setOpen(false)} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={(e)=>setOpen(false)} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Documento
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
    const fileType2=props.fileType.split("/").length>1?props.fileType.split("/")[1]:props.fileType;
    return (
    <div  className="custom-viewer">
        <FileViewer
        fileType={fileType2}
        filePath={`data:${fileType};base64,${file}`}/>
    </div>
    );
}

export default ShowFile;