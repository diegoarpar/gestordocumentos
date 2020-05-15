import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://localhost:2001";
function  ProcessTaskInformationServices  () { 
}

async function  GetProcessesTaskInformation(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTaskInformation/getTaskInformation/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessTaskInformationServices,
    GetProcessesTaskInformation
};