import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://192.168.0.12:2001";
function  ProcessTaskServices  () { 
}

async function GetTask(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/getTask",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function AssignTask(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/assign",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function CompleteTask(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTask/completeTask",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessTaskServices,
    GetTask,
    AssignTask,
    CompleteTask
};