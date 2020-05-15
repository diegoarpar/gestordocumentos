import React,{useState, useEffect } from 'react';
import {FormBuilder} from 'react-formio';
import Button from '@material-ui/core/Button';
import ProcessFormServices from '../../services/processServicesForm';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import ProcessActivityServices from "../../services/processActivityServices";
var builder;

const ProcessRadicationForm=(props)=>{
  const [list, setList] = useState([]);
  const [listIndex, setListIndex] = useState(-1);
  const information=props.information;
  const [cont, setCont] = useState(0);
  const [components, setComponents] = useState([]);
  const [itemList, setItemList] = useState();

  const handleChangeList = (e) => {
    setListIndex(e.target.value);
    setItemList(list[e.target.value]);
  };
  const saveBuilder=(form)=>{
    builder=form;

  }
  const handleLoadForm=(e)=>{
    ProcessFormServices.GetProcessesForm({"processName":information.name,"activityName":itemList.name}).then((data)=>{
      if(!!data&&data.length>0)
      setComponents(data[0].components);

  });
  }
  
  const saveBuilderButton=()=>{
    builder.processName=information.name;
    builder.activityName=itemList.name;
    ProcessFormServices.DeleteProcessForm({"processName":information.name,"activityName":itemList.name}).then((data)=>{
      setCont(cont+1);
      ProcessFormServices.CreateProcessForm(builder).then((data)=>{setCont(cont+1)});
    });
    
  }
  
  useEffect(() => {
   
    ProcessActivityServices.GetProcessesActivity({"processName":information.name})
    .then((data)=>{
      setList(data);
    });
    },[cont]);

  return (
    <div>
      <FormControl >
        <InputLabel id="seletedActivity">Actividad</InputLabel>
        <Select
          id="imple-select"
          value={listIndex}
          onChange={handleChangeList}
        >
          {list.map((item,index) => (
                <MenuItem key={item.id}  value={index}>{item.name}</MenuItem>
              ))}
          
        </Select>
      </FormControl>
      <Button variant="contained" color="primary"  
              onClick={(e) => {
                handleLoadForm(e);

              }}>
              Cargar
          </Button>
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