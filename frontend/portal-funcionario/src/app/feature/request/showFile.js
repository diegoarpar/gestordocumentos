import React,{ useState,useEffect } from 'react';
import FileViewer from 'react-file-viewer';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import FileManager from '../../services/fileManagementServices';
const ShowFile =(props)=>{
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