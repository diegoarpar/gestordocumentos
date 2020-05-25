import React,{useEffect, useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const UsersInformation=(props) =>{
  const rows =props.rows;
  console.log(rows);

  
  return (

    <div>
    <List >
      {rows.map((row)=>{
          return (
          <UsersInformationItem 
            row={row}
          
             />)
      })

      }
      
      
    </List>
    
    </div>
  );
}

const UsersInformationItem=(props)=>{
    const row=props.row;
    return(
        <div key={row._id} className="customProcesses">
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
                {row.documentType+" "+row.documentNumber+" "+row.name+ " "+ row.lastName}
              </Typography>
              {row.documentNumber+" "+row.name+ " "+ row.lastName}
            </React.Fragment>
          }
        />
        <Button key={row.id+"B1"}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick="#"
        >
          Seleccionar
        </Button>
        
        <Button key={row.id+"B2"}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick="#"
        >
          Ver Detalle
        </Button>
        
      </ListItem>
      </div>
    )
}

export default UsersInformation ;