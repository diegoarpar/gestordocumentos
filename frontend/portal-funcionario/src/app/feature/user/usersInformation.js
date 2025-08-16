import React,{useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserDetailDialog from "./userDetailDialog";
const UsersInformation=(props) =>{
  const rows =props.rows;
  const setCitizen=props.setCitizen;

  
  return (

    <div>
    <List >
      {rows.map((row)=>{
          return (
          <UsersInformationItem 
            row={row}
            setCitizen={setCitizen}
             />)
      })

      }
      
      
    </List>
    
    </div>
  );
}

const UsersInformationItem=(props)=>{
    const row=props.row;
    const setCitizen=props.setCitizen;
    return(
        <div key={row._id} >
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
            {!!setCitizen&&<Button key={row.id + "B1"}
                     aria-controls="customized-menu"
                     aria-haspopup="true"
                     variant="contained"
                     color="primary"
                     onClick={()=>setCitizen(row)}
            >
                Seleccionar
            </Button>
            }

            <UserDetailDialog row={row}/>
        
      </ListItem>
      </div>
    )
}

export default UsersInformation ;