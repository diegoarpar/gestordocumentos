import React,{useState,useEffect} from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import SessionCookie from '../utils/session';
import axios from "axios";


var hostServices="http://192.168.0.16:8000";
hostServices="http://localhost:5000";
function  UsersServices  () {
    
   
}
async function  LogIn(data){
    return axios.post(hostServices+"/authentication/validateuser/",data)
    .then(data =>{
        return data.data
    })
}
async function  GetData(){
    var headers={};
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    headers.Tenant="Tenant de Diego";
    return axios.get(hostServices+"/authentication/users/",{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  CreateUser(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post(hostServices+"/authentication/createuser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateUser(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post(hostServices+"/authentication/updateUser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  ChangePassword(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post(hostServices+"/authentication/changePassword/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function GetRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post(hostServices+"/authentication/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  SaveRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.put(hostServices+"/authentication/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  DeleteRoles(data){
    var headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.delete(hostServices+"/authentication/roles/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
export default  {GetData,
    CreateUser,
    ChangePassword,
    UpdateUser,
    LogIn,
    GetRoles,
    SaveRoles,
    UsersServices,
    DeleteRoles
};