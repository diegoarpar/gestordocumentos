import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Administration();
function  ProcessVariableServices  () { 
}

async function  GetProcessesVariable(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/variable/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessVariableServices,
    GetProcessesVariable
};