import {GetSessionCookie} from './session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Workflowmanager();
function  ProcessTaskServices  () { 
}

async function GetTask(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/getTask",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function AssignTask(data){
    const session = GetSessionCookie();
    const res = await fetch(`/api/workflow/process/task/assign/${data.taskId}/${data.user}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': 'Bearer ' + session.access_token,
        },
        credentials: 'include',
    });
    return res.json();
}
async function getHistory(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/getHistory",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function CompleteTask(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/completeTask",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessTaskServices,
    GetTask,
    AssignTask,
    CompleteTask,
    getHistory

};