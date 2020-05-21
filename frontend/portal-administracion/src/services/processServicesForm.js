import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();
function  ProcessServicesForm  () { 
}

async function  GetProcessesForm(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/form/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  CreateProcessForm(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/process/form/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateProcessForm(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/process/form/modify/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  DeleteProcessForm(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/form/delete/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessServicesForm,
    GetProcessesForm,
    CreateProcessForm,
    DeleteProcessForm,
    UpdateProcessForm
};