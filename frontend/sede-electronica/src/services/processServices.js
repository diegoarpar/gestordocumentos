import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://192.168.0.12:5001";
function  ProcessServices  () { 
}

async function  GetProcesses(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/administration/process/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessServices,
    GetProcesses
};