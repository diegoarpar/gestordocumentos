import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();

async function  GetEmailConfiguration(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/emailConfiguration/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function  CreateEmailConfiguration(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/emailConfiguration/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateEmailConfiguration(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/emailConfiguration/update/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function  DeleteEmailConfiguration(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/emailConfiguration/delete/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
export default  {
    CreateEmailConfiguration,
    GetEmailConfiguration,
    UpdateEmailConfiguration,
    DeleteEmailConfiguration
};