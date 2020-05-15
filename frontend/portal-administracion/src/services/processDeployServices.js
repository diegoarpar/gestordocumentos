import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://localhost:2001";
function  ProcessDeployServices  () { 
}

async function  ProcessesDeploy(data){
    var headers={'Content-Type': 'multipart/form-data'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processDefinition/uploadProcessDefinition/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}


export default  {
    ProcessDeployServices,
    ProcessesDeploy
};