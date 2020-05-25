import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();
function  SedeElectronicaGeneralServices  () { 
}

async function  GetSedeElectronicaGeneral(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/sedeelectronica/general/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  CreateSedeElectronicaGeneral(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/sedeelectronica/general/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateSedeElectronicaGeneral(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/sedeelectronica/general/modify/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  DeleteSedeElectronicaGeneral(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/sedeelectronica/general/delete/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    SedeElectronicaGeneralServices,
    GetSedeElectronicaGeneral,
    CreateSedeElectronicaGeneral,
    DeleteSedeElectronicaGeneral,
    UpdateSedeElectronicaGeneral
};