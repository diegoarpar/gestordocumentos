import {GetSessionCookie} from './session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_Workflowmanager();
function  ProcessTaskInformationServices  () { 
}

async function  GetProcessesTaskInformation(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+GetSessionCookie().access_token;
    headers.Tenant=GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/workflowmanager/processTaskInformation/getTaskInformation/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {
    ProcessTaskInformationServices,
    GetProcessesTaskInformation
};