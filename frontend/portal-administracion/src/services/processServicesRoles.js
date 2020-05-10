import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://localhost:5001";
function  ProcessServicesRoles  () { 
}

async function  GetProcessesRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  CreateProcessRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/process/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateProcessRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/process/roles/modify/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  DeleteProcessRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/roles/delete/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessServicesRoles,
    GetProcessesRoles,
    CreateProcessRoles,
    DeleteProcessRoles,
    UpdateProcessRoles
};