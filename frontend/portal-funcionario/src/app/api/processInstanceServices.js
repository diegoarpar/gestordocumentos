import {GetSessionCookie} from './session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Workflowmanager();
function  ProcessInstanceServices  () { 
}

async function InitProcesses(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processInstance/initProcessInstance",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function getRequestNumber(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/numberService/getProcessNumber",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function getHistory(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processInstance/getHistory",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function GetDiagram(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processInstance/diagram/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessInstanceServices,
    InitProcesses,
    GetDiagram,
    getRequestNumber,
    getHistory
};