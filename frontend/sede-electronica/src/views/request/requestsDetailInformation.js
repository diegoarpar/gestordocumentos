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
import RequestDocument from "./requestsDocuments";
import a11yProps from "../../utils/a11yProps";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import useStylesCard from "../../utils/useStylesCard";
import TabPanel from "../../utils/tabPanel";
import RequestTaskGeneralInformation from "./requestTaskGeneralInformation";
const RequestDetailInformation=(props) =>{
    const row = props.row;
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
            Ver detalle
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
                        <Tab label="Información" {...a11yProps(0)} />
                        <Tab label="Documentos" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div>
                        <RequestTaskGeneralInformation row={row}/>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        <RequestDocument.RequestList row={row} numeroRadicado={row.requestNumber}/>
                    </div>
                </TabPanel>
        </Dialog>

    </div>);

}

export default RequestDetailInformation ;