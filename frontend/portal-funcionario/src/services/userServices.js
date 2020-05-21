import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Autenticacion();

function  UsersServices  () {
    
   
}
async function  LogIn(data){
    var headers={};
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant
    return axios.post(hostServices+"/authentication/validateuser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  GetData(){
    var headers={};
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.get(hostServices+"/authentication/users/",{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  CreateUser(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/createuser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateUser(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/updateUser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  ChangePassword(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/changePassword/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function GetRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function GetRolesProcess(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/processroles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  GetTenant(data){
    var headers={'Content-Type': 'application/json'}
    return axios.post(hostServices+"/authentication/tenant/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}


async function GetPortals(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/authentication/portals/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}


export default  {GetData,
    CreateUser,
    ChangePassword,
    UpdateUser,
    LogIn,
    GetRoles,
    GetRolesProcess,
    UsersServices,
    GetTenant,
    GetPortals
    
};