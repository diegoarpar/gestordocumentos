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
import ProcessTaskServices from '../../services/processTaskServices';
import a11yProps from "../../utils/a11yProps";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import RequestDocuments from './requestsDocuments';
import ProcessInstanceServices from "../../services/processInstanceServices";
import ShowProcessModel from "../displayModel/showProcessModel";
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

const RequestTaskDetailInformation=(props) =>{
    const row=props.row;
    const [open, setOpen]= useState(false);
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (<div>
        <Button variant="contained"
                color="inherit"
                onClick={()=>setOpen(true)}
        >
            Histórico
        </Button>

        <Dialog fullScreen open={open} >
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" >
                        Detalle de la tarea
                    </Typography>
                </Toolbar>
            </AppBar>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Detalle de la tarea" {...a11yProps(0)} />
                        <Tab label="Historial de eventos" {...a11yProps(1)} />
                        <Tab label="Documentos" {...a11yProps(2)} />
                        <Tab label="Estado" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div>
                        Detalle de la tarea
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        <RequestList row={row}/>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>
                        <RequestDocuments.RequestList row={row} numeroRadicado={row.requestNumber}/>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        <ShowModel processInstanceId={row.processInstanceId}></ShowModel>
                    </div>
                </TabPanel>
        </Dialog>

    </div>);

}
const ShowModel=(props)=>{
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState();
    const processInstanceId = props.processInstanceId;
    useEffect(()=>{
        ProcessInstanceServices.GetDiagram({"processInstanceId":processInstanceId})
            .then((data)=>{
                setFile(data);
                console.log(data);
            });
    },[]);
    return (<div>
        {file!=null&&<ShowProcessModel.Viewer file={file}  fileType="png"/>}
    </div>)
}
const RequestList=(props) =>{
  const [rows, setRows]=useState([]);
  const cont = props.contTramites;
  const row= props.row;
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
      ProcessTaskServices.getHistory({"processInstanceId":row.processInstanceId})
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

             />)
      })

      }
      
      
    </List>
    </div>
  );
}

const RequestItem=(props)=>{
    const row=props.row;
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
          primary={!!row.processName?row.processName:"" + !!row.taskDescription?row.taskDescription:""}
          color ="inherit"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {
                }
              </Typography>
                {row.processName}
                {!!row.requestNumber?" #"+row.requestNumber:""}
                {!!row.processInstanceStatus?" Estado "+row.processInstanceStatus:"" }
                {!!row.taskDescription?" Actividad "+row.taskDescription:""}
                {!!row.action?" Acción "+row.action:""}

            </React.Fragment>
          }
        />
      </ListItem>
      </div>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'span'} variant={'body2'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
export default RequestTaskDetailInformation ;