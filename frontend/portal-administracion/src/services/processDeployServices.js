import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Workflowmanager();
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