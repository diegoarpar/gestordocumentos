import React,{useState, useEffect } from 'react';
import ProcessRolesServices from '../../services/processServicesRoles'
import ParametricServices from '../../services/parametricvaluesService'
import {FormBuilder} from 'react-formio';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ProcessFormServices from '../../services/processServicesForm';

  const useStyles = {
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  };

var builder;

const ProcessRadicationForm=(props)=>{
  const [information, setInformation] = useState(props.information);
  const [formBuilder, setFormBuilder] = useState(props.formBuilder);
  const [cont, setCont] = useState(0);
  const [components, setComponents] = useState([]);

  const saveBuilder=(form)=>{
    builder=form;

  }
  
  const saveBuilderButton=()=>{
    console.log(builder);
    builder.processName=information.name;
    ProcessFormServices.DeleteProcessForm({"processName":information.name}).then((data)=>{
      setCont(cont+1);
      ProcessFormServices.CreateProcessForm(builder).then((data)=>{setCont(cont+1)});
    });
    
  }
  
  useEffect(() => {
    ProcessFormServices.GetProcessesForm({"processName":information.name}).then((data)=>{
        if(!!data&&data.length>0)
        setComponents(data[0].components);

    });
      
    },[cont]);

  return (
    <div>
          <Button variant="contained" color="secondary"  
              onClick={(e) => {
                saveBuilderButton();

              }}>
              Guardar
          </Button>
        <FormBuilder form={{display: 'form',components:components}}  
        
        options={
          {
            saveDraft: true,
            builder: {
              layout: false,
              premium: false
            },
            editForm: {
              textfield: [
                {
                  key: 'api',
                  ignore: true
                }        
              ]
            }
          }
        } 
        saveText='Guardar' onChange={(schema) => saveBuilder(schema)} />
    </div>
  );
}

export default ProcessRadicationForm;