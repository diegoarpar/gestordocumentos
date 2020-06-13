import React,{useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import SessionCookies from '../../utils/session';
import UserServices from '../../services/userServices';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ProcessInstanceServices from '../../services/processInstanceServices';
import FileManagementServices from '../../services/fileManagementServices';
import ShowFile from "./showFile";

const useStyles = makeStyles((theme) => ({
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


export default RequestDocument ;