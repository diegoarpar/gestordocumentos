import React,{useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ProcessTaskServices from '../../services/processTaskServices';
import SessionCookies from '../../utils/session';
import UserServices from '../../services/userServices';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ProcessTaskForm from './processTaskForm'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const TaskList=(props) =>{
  const [taskList, setTaskList]=useState([]);
  const [cont, setCont]=useState(0);
  const [openTask, setOpenTask]=useState(false);
  const classes = useStyles();
  const [rowOpen, setRowOpen]=useState();
  const handleAssignMeTask=(row,e)=>{
    ProcessTaskServices.AssignTask({"user":SessionCookies.GetSessionCookie().authenticated_userid, 
                                    "taskId":row.taskId})
    .then((data)=>{
      setCont(cont+1);
    });
    
  }
  const handleCompleteTask=(row,e)=>{
    
  }
  const handleOpenTask=(row,e)=>{
    setOpenTask(true);
    setRowOpen(row);
  }
  const handleCloseTask=()=>{
    setOpenTask(false);
    
  }
  useEffect(()=>{
    UserServices.GetRolesProcess({"user":SessionCookies.GetSessionCookie().authenticated_userid}).then((data)=>{
      var temp=[];
      data.map((row)=>{
        temp.push(row.roleName);
      });

      ProcessTaskServices.GetTask({"user":SessionCookies.GetSessionCookie().authenticated_userid,"roles":temp})
      .then((data)=>{
          setTaskList(data);
      });
    });

  },[cont]);
  return (

    <div>
    <List className={classes.root}>
      {taskList.map((row)=>{
          return (<TaskItem key={row.taskId} key2={row.taskId} information={row}
             handleAssignMeTask={handleAssignMeTask}
             handleCompleteTask={handleCompleteTask}
             handleOpenTask={handleOpenTask}
             />)
      })

      }
      
      
    </List>

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
          <ProcessTaskForm information = {rowOpen} handleClose={handleCloseTask} ></ProcessTaskForm>
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
    const user = SessionCookies.GetSessionCookie().authenticated_userid;
    return(
        <div key={key}>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
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
              {row.taskId +(!!row.assign?" Asignado a "+row.assign:" Sin asignar") + " con prioridad "+row.priority}
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
        {(!!row.assign||row.assign==user)&&<Button key={key}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={(e)=>handleOpenTask(row)}
        >
          Abrir
        </Button>
        }
      </ListItem>
      </div>
    )
}

export default TaskList ;