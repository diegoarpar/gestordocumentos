import SessionCookie from '../utils/session';
import axios from "axios";
import URL_Services from '../config/url.config';

var hostServices=URL_Services.URL_FileManager();

async function radicarDocumentos(data){
    var headers={};
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/carpetaDocumental/radicarDocumentosCliente",data,{headers:headers})
        .then(data =>{
            debugger;
            return data.data
        })
}
async function getCarpetaDocumental(data){
    var headers={};
    headers.Tenant=SessionCookie.GetSessionCookieTenant().tenant;
    return axios.post(hostServices+"/consultarCarpetaDocumental/expediente",data,{headers:headers})
        .then(data =>{
            return data.data
        })
}
export default  {
    radicarDocumentos,
    getCarpetaDocumental
};