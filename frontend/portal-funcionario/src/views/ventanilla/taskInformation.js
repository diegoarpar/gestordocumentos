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
  const classes = useStyles();
  
  useEffect(()=>{
    ProcessTaskServices.GetTask({"user":"diego5","roles":["INICIAR_PQR","DIGITALIZADOR","managers"]})
    .then((data)=>{
        setTaskList(data);
    });

  },[cont]);
  return (
    <List className={classes.root}>
      {taskList.map((row)=>{
          return (<TaskItem information={row}/>)
      })

      }
      
      
    </List>
  );
}

const TaskItem=(props)=>{
    const row=props.information;
    return(
        <div>
             <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={row.taskName}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                
                color="textPrimary"
              >
                {row.processKey}
              </Typography>
              {row.taskId}
            </React.Fragment>
          }
        />
      </ListItem>
      </div>
    )
}

export default TaskList ;