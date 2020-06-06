import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Workflowmanager();
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
async function getRequestNumber(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/numberService/getProcessNumber",data,{headers:headers})
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
    GetDiagram,
    getRequestNumber
};