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
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import CustomInput from "components/CustomInput/CustomInput.js";
import Password from "@material-ui/icons/VpnKey";
import useStyles from "../../utils/useStyles";
import useStylesCard from "../../utils/useStylesCard";
import EmailConfigurationServices from "../../services/emailConfigurationServices";

const EmailTemplateDetail=(props) =>{
    const row=props.row;
    const [open, setOpen]= useState(false);
    const [value, setValue] = useState(0);
    const [cont, setCont] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (<div>
            <Form cont={cont} setCont={setCont}></Form>
            <ListDetail cont={cont} setCont={setCont}></ListDetail>
    </div>);

}

const Form=(props)=>{
    const cont= props.cont;
    const setCont= props.setCont;
    const [name,setName] = useState();
    const [template,setTemplate] = useState();
    const [subject,setSubject] = useState();
    const [variables,setVariables] = useState([]);
    const [variable,setVariable] = useState();
    const classes = useStyles;
    const handleClickVariable=(row)=>{
        setVariables(variables=>variables.concat(variable));
    }
    const handleClickRemoveVariable=(row)=>{
        setVariables(variables.filter(item=>item!=row));
    }
    const handleClick=(row)=>{
        let data ={
            "TYPE":"TEMPLATE",
            "name": name,
            "template": template,
            "subject": subject,
            "variables": variables,
        }
        EmailConfigurationServices.CreateEmailConfiguration(data)
            .then((data)=>{
                setCont(cont+1);
            });
    }
    return (
        <div>
        <CustomInput
            labelText="Nombre..."
            id="setName"
            formControlProps={{
                fullWidth: true
            }}
            inputProps={{
                type: "text",
                onChange: (e) => {setName(e.target.value)},
                endAdornment: (
                    <InputAdornment position="end">
                        <People className={classes.inputIconsColor} />
                    </InputAdornment>
                )
            }
            }
        />
            <CustomInput
                labelText="Asunto..."
                id="setSubject"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    type: "text",
                    onChange: (e) => {setSubject(e.target.value)},
                    endAdornment: (
                        <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                        </InputAdornment>
                    )
                }
                }
            />
        <CustomInput
            labelText="Template..."
            id="setTemplate"
            formControlProps={{
                fullWidth: true
            }}
            inputProps={{
                type: "text",
                multiline: true,
                onChange: (e) => {setTemplate(e.target.value)},
                endAdornment: (
                    <InputAdornment position="end">
                        <People className={classes.inputIconsColor} />
                    </InputAdornment>
                )
            }
            }
        />


        <Button variant="contained" color="primary"
                onClick={(e) =>handleClick()}>
            Guardar
        </Button>
    </div>);
}
const ListDetail=(props) =>{
  const [rows, setRows]=useState([]);
  const cont = props.cont;
  const row= props.row;
  const setCont=props.setCont;
  const classes = useStylesCard;

  useEffect(()=>{
    EmailConfigurationServices.GetEmailConfiguration({"TYPE":"TEMPLATE"})
        .then((data)=>{
            setRows(data);
        });
  },[cont]);

  return (
    <div>
        <List className={classes.root}>
          {rows.map((row,index)=>{
              return (
                  <ListRow
                      key={row.intex} key2={index} row={row}
                      setCont={setCont} cont={cont}
                 />)
            })
          }
        </List>
    </div>
  );
}

const ListRow=(props)=>{
    const row=props.row;
    const setCont=props.setCont;
    const cont=props.cont;
    const handleClick=(row)=>{
        delete row["_id"];
        EmailConfigurationServices.DeleteEmailConfiguration(row)
            .then((data)=>{
                setCont(cont+1);
            });
    }
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
                {row.name}
                {!!row.template?" Template "+row.template:""}

            </React.Fragment>
          }
        />
            <Button variant="contained" color="primary"
                    onClick={(e) =>handleClick(row)}>
                X
            </Button>
      </ListItem>
      </div>
    )
}


export default EmailTemplateDetail;