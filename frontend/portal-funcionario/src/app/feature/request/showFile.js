import React,{ useState,useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import FileManager from '@/app/api/fileManagementServices';

const ShowFile =(props)=>{
  const [file, setFile]=useState();
    const fileType=props.row.tipo;
    const numeroRadicado=props.numeroRadicado;
    const open=props.open;
    const setOpen=props.setOpen;
    const row=props.row;
    useEffect(()=>{
        let filter={"nombre":row.nombre, "numeroRadicado":numeroRadicado};
        FileManager.consultarArchivo(filter)
            .then((data)=>{
                setFile(data);
            });
    });
    return (
    <div>
        <Dialog fullScreen open={open} onClose={()=>setOpen(false)} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
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
    const mimeMain=fileType.split("/")[0];
    const src=`data:${fileType};base64,${file}`;
    if(mimeMain==="image"){
        return <div className="custom-viewer"><img src={src} style={{maxWidth:'100%',height:'auto'}} alt="Documento" /></div>;
    }
    if(fileType==="application/pdf"){
        return <div className="custom-viewer" style={{height:'100%'}}><embed src={src} type="application/pdf" width="100%" height="100%" /></div>;
    }
    return (
    <div className="custom-viewer" style={{padding:'2rem',textAlign:'center'}}>
        <Typography>Vista previa no disponible para este tipo de archivo.</Typography>
        <a href={src} download={`documento.${fileType.split("/")[1]||"bin"}`}>Descargar archivo</a>
    </div>
    );
}

export default ShowFile;