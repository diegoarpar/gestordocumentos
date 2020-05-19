import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://192.168.0.12:2001";
function  ProcessInstanceServices  () { 
}

async function InitProcesses(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processInstance/initProcessInstance",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function GetDiagram(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processInstance/diagram/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessInstanceServices,
    InitProcesses,
    GetDiagram
};