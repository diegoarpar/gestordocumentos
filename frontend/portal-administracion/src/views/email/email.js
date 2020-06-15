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
import a11yProps from "../../utils/a11yProps";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import EmailConfigurationDetail from "./emailConfigrationDetail";
import EmailTemplateDetail from "./emailTemplateDetail";
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

const EmailInformation=(props) =>{
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
            Administrar Correo
        </Button>

        <Dialog fullScreen open={open} >
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={()=>setOpen(false)} aria-label="close">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" >
                        Administrar Correo Electronico
                    </Typography>
                </Toolbar>
            </AppBar>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Detalle de la configuracion" {...a11yProps(0)} />
                        <Tab label="Templates" {...a11yProps(1)} />


                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div>
                        <EmailConfigurationDetail></EmailConfigurationDetail>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        <EmailTemplateDetail></EmailTemplateDetail>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>

                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        Estado
                    </div>
                </TabPanel>
        </Dialog>

    </div>);

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
export default EmailInformation ;