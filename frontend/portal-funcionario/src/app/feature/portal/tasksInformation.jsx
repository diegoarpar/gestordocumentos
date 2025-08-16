"use client";
import React,{useEffect, useState} from 'react';
import { styled }  from "@mui/material/styles";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ProcessTaskServices from '@/app/api/processTaskServices';
import UserServices from '@/app/api/userServices';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ProcessTaskForm from './processTaskForm'
import ProcessInstanceServices from '@/app/api/processInstanceServices';
import ShowProcessModelInstance from '../displayModel/showProcessModel';

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

const TaskList=(props) =>{
  const [taskList, setTaskList]=useState([]);
  const cont = props.contTramites;
  const setCont=props.handleContTramites;
  const [openTask, setOpenTask]=useState(false);
  const [openDiagram, setOpenDiagram]=useState(false);
  const [file, setFile]=useState();
  const classes = useStyles();
  const [rowOpen, setRowOpen]=useState();
  const handleAssignMeTask=(row,e)=>{
    ProcessTaskServices.AssignTask({"user":'authenticated_userid', 
                                    "taskId":row.taskId})
    .then((data)=>{
      setCont(cont+1);
    });
    
  }
  const handleCompleteTask=(row,e)=>{
    
  }
  const handleOpenDiagram=(row,e)=>{
    
    ProcessInstanceServices.GetDiagram({"processInstanceId":row.processInstanceId})
    .then((data)=>{
      
      setFile(data); 
      setOpenDiagram(true)
    });
    
  }
  const handleOpenTask=(row,e)=>{
    setOpenTask(true);
    setRowOpen(row);
  }
  const handleCloseTask=()=>{
    setOpenTask(false);
    
  }
  useEffect(()=>{
    UserServices.GetRolesProcess({"user":''}).then((data)=>{
      var temp=[];
      data.map((row)=>{
        temp.push(row.roleName);
      });

      ProcessTaskServices.GetTask({"user":'',"roles":temp})
      .then((data)=>{
          setTaskList(data);
      });
    });

  },[cont]);

  return (

    <div>
    <List className={classes.root}>
      {taskList.map((row)=>{
          return (
              <TaskItem
                  key={row.taskId} key2={row.taskId} information={row}
             handleAssignMeTask={handleAssignMeTask}
             handleCompleteTask={handleCompleteTask}
             handleOpenTask={handleOpenTask}
             handleOpenDiagram={handleOpenDiagram}
             />)
      })

      }
      
      
    </List>
    <ShowProcessModelInstance.ShowProcessModelInstance open={openDiagram} handleClose={setOpenDiagram} file={file} fileType="png"/>

    <Dialog fullScreen open={openTask} onClose={handleCloseTask} >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCloseTask} aria-label="close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" >
                Completar Tarea
              </Typography>
            </Toolbar>
          </AppBar>
          <ProcessTaskForm 
              information = {rowOpen}
              handleClose={handleCloseTask} 
              contTramites={cont}
              handleContTramites={setCont}
              >

              </ProcessTaskForm>
          </Dialog>
    </div>
  );
}

const TaskItem=(props)=>{
    const row=props.information;
    const handleOpenTask=props.handleOpenTask;
    const key = props.key2;
    const handleAssignMeTask=props.handleAssignMeTask;
    const handleCompleteTask=props.handleCompleteTask;
    const user = '';
    const handleOpenDiagram= props.handleOpenDiagram;
    return(
        <div key={key} >
        <Divider variant="inset" component="li" className="customProcesses" />
        <ListItem alignItems="flex-start" className="customProcesses">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={row.taskDescription}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {row.processName+ " "}
              </Typography>
              {"#"+row.requestNumber +(!!row.assign?" Asignado a "+row.assign:" Sin asignar")
              + " con prioridad "+row.priority
              + " Estado: "+row.processInstanceStatus
              }
            </React.Fragment>
          }
        />
        {!(!!row.assign)&&<Button key={key}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={(e)=>handleAssignMeTask(row,e)}
        >
          Tomar
        </Button>
        }
        {((row.assign==null)||(!!row.assign||row.assign==user))&&<Button key={key}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={(e)=>handleOpenTask(row)}
        >
          Abrir
        </Button>
        }
        {<Button key={"E"+key}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={(e)=>handleOpenDiagram(row)}
        >
          Ver estado
        </Button>
        }
      </ListItem>
      </div>
    )
}


export default TaskList ;