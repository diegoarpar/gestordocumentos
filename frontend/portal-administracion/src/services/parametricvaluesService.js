import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();
function  ParameticServices  () { 
}

async function  GetParametric(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/parametricvalue/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  CreateParametric(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/parametricvalue/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateParametric(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/parametricvalue/modify/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  DeleteParametric(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/parametricvalue/delete/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ParameticServices,
    GetParametric,
    CreateParametric,
    UpdateParametric,
    DeleteParametric
};