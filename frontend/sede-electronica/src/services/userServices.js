import React,{useState,useEffect} from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import SessionCookie from '../utils/session';
import axios from "axios";



function  UsersServices  () {
    
   
}
async function  LogIn(data){
    return axios.post("http://192.168.0.16:8000/authentication/validateuser/",data)
    .then(data =>{
        return data.data
    })
}
async function  GetData(){
    var headers={};
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.get("http://localhost:5000/authentication/users/",{headers:headers})
    .then(data =>{
        return data.data
    })
}

async function  CreateUser(data, headers){
    if(!headers)headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post("http://localhost:5000/authentication/createuser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  UpdateUser(data, headers){
    if(!headers)headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post("http://localhost:5000/authentication/createuser/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}
async function  ChangePassword(data, headers){
    if(!headers)headers={'Content-Type': 'application/json'}
    headers.Authentication="Bearer "+SessionCookie.GetSessionCookie().access_token;
    return axios.post("http://localhost:5000/authentication/changePassword/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {GetData,CreateUser,ChangePassword, UpdateUser,LogIn,UsersServices};