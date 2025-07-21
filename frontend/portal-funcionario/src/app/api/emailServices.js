import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();

async function  GetEmail(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/email/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function  CreateEmail(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/email/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateEmail(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.put(hostServices+"/administration/email/update/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
async function  DeleteEmail(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/email/delete/",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
export default  {
    CreateEmail,
    GetEmail,
    UpdateEmail,
    DeleteEmail
};