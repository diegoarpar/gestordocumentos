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
import ProcessInstanceServices from '@/app/api/processInstanceServices';
import RequestTaskDetailInformation from "./requestsTaskDetailInformation";
import a11yProps from "../../src/utils/a11yProps";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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

const RequestInformation=(props) =>{
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
            Mi carpeta
        </Button>

        <Dialog fullScreen open={open} >
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" >
                        Mi Carpeta
                    </Typography>
                </Toolbar>
            </AppBar>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Búsqueda" {...a11yProps(0)} />
                        <Tab label="Histórico" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={1}>
                    <div>
                        <RequestList/>
                    </div>
                </TabPanel>
        </Dialog>

    </div>);

}
const RequestList=(props) =>{
  const [rows, setRows]=useState([]);
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
    ProcessInstanceServices.getHistory({"requesterF.user":''})
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
          primary={row.processName}
          color ="inherit"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {row.processName

                }
              </Typography>
                { " #"+row.requestNumber+ " "
                 +" Estado "+ row.processInstanceStatus}
            </React.Fragment>
          }
        />


        <RequestTaskDetailInformation row={row}/>
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
export default RequestInformation ;