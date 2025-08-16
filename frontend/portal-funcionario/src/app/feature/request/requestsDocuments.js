import React,{useEffect, useState} from 'react';
import { styled } from "@mui/material/styles";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import FileManagementServices from '@/app/api/fileManagementServices';
import ShowFile from "./showFile";
import Box from '@mui/material/Box';

const useStyles = styled(Box)(({ theme }) => ({
  root: {
    width: '100%',
    maxWidth: '100% ',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  }
}));

const RequestDocument=(props) =>{
    const [open, setOpen]= useState(false);
    const row=props.row;
    const numeroRadicado=props.row.requestNumber;
    return (<div>
        <Button variant="contained"
                color="inherit"
                onClick={()=>setOpen(true)}
        >
            Ver mis documentos
        </Button>

        <Dialog fullScreen open={open} >
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" >
                        Documentos
                    </Typography>
                </Toolbar>
                <RequestList row={row} numeroRadicado={numeroRadicado}/>
            </AppBar>

        </Dialog>

    </div>);

}
const RequestList=(props) =>{
  const [rows, setRows]=useState([]);
  const rowInfo = props.row;
  const numeroRadicado = props.numeroRadicado;
  const cont = props.contTramites;
  const setCont=props.handleContTramites;
  const [openTask, setOpenTask]=useState(false);
  const [openDiagram, setOpenDiagram]=useState(false);
  const [file, setFile]=useState();
  const classes = useStyles();
  const [rowOpen, setRowOpen]=useState();
  const handleCloseTask=()=>{
    setOpenTask(false);

  }
  useEffect(()=>{
      FileManagementServices.getCarpetaDocumental({"numeroRadicado":rowInfo.requestNumber})
        .then((data)=>{
            setRows(data);
        })

  },[cont]);

  return (

    <div>

    <List className={classes.root}>
      {rows.map((row,index)=>{
          return (
              <RequestItem
                  key={row.intex} key2={index} row={row}
                  numeroRadicado={numeroRadicado}
             />)
      })

      }
      
      
    </List>
    </div>
  );
}

const RequestItem=(props)=>{
    const row=props.row;
    const [open, setOpen] = useState(false);
    const numeroRadicado=props.numeroRadicado;
    const handleOpenTask=props.handleOpenTask;
    const key = props.key2;
    return(
        <div key={"div1"+key} >
        <Divider variant="inset" component="li" className="customProcesses" />
        <ListItem alignItems="flex-start" className="customProcesses">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={row.nombre}
          color ="inherit"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {row.nombre + " "+row.tipo+ " "}
              </Typography>
                {"Estado"}
            </React.Fragment>
          }
        />


        {<Button key={"E"+key}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={(e)=>setOpen(true)}
        >
          Ver documento
        </Button>
        }
        <ViewDocument row={row} open={open} setOpen={setOpen} numeroRadicado={numeroRadicado}></ViewDocument>
      </ListItem>
      </div>
    )
}

const ViewDocument=(props) =>{
    const row=props.row;
    const numeroRadicado=props.numeroRadicado;
    const open= props.open;
    const setOpen = props.setOpen;
    return (<div>
        <ShowFile open={open} setOpen={setOpen} row={row} numeroRadicado={numeroRadicado}/>
    </div>);

}


export default {RequestDocument, RequestList };