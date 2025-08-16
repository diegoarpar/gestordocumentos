import React,{useEffect, useState} from 'react';
import { styled }  from "@mui/material/styles";
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
import ProcessTaskServices from '@/app/api/processTaskServices';
import a11yProps from "../../src/utils/a11yProps";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import RequestDocuments from './requestsDocuments';
import ProcessInstanceServices from "@/app/api/processInstanceServices";
import ShowProcessModel from "../displayModel/showProcessModel";
import RequestTaskGeneralInformation from "./requestTaskGeneralInformation";
import TabPanel from "../../src/utils/tabPanel";
const useStyles = styled((theme) => ({
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
                        Información de la solicitud
                    </Typography>
                </Toolbar>
            </AppBar>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Información General" {...a11yProps(0)} />
                        <Tab label="Historial de eventos" {...a11yProps(1)} />
                        <Tab label="Documentos" {...a11yProps(2)} />
                        <Tab label="Estado" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div>
                        <RequestTaskGeneralInformation row={row} />
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
export default RequestTaskDetailInformation ;