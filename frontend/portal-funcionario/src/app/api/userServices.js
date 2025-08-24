import axios from "axios";
import {GetSessionCookie, GetSessionCookieTenant} from './session';

function  UsersServices  () {
   
}
async function  LogIn(data) {
    var headers={};
    return await fetch("/api/authentication/login",{
        method: 'GET',
        headers: {Authorization: [data]}
    });
}
async function  GetData() {
    return await fetch("/authentication/users/",{
        method: 'GET',
        headers: {Authorization: [data]}
    });
}
async function  GetUser(data) {
    return await fetch("/authentication/users/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,

    });
}
async function  CreateUser(data) {
    return await fetch("/authentication/createuser/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}
async function  UpdateUser(data) {
    return await fetch("/authentication/updateUser/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}
async function  ChangePassword(data) {
    return await fetch("/authentication/changePassword/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}

async function GetRoles(data) {
        return await fetch("/authentication/roles/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}
async function GetRolesProcess(data) {
    return await fetch("/authentication/processroles/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}

async function  GetTenant(data) {
    return await fetch("/authentication/tenant/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}


async function GetPortals(data) {
    return await fetch("/authentication/portals/",{
        method: 'post',
        headers: {Authorization: [data]},
        body: data,
    });
}


export default  {GetData,
    CreateUser,
    ChangePassword,
    UpdateUser,
    LogIn,
    GetRoles,
    GetRolesProcess,
    UsersServices,
    GetTenant,
    GetPortals,
    GetUser
};