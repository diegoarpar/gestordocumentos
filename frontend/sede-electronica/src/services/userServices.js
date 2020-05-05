import React,{useState,useEffect} from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
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
    return axios.get("http://localhost:5000/authentication/users/")
    .then(data =>{
        return data.data
    })
}

async function  CreateUser(data, headers){
    return axios.post("http://localhost:5000/authentication/users/",data,{headers:headers})
    .then(data =>{
        return data.data
    })
}

export default  {GetData,CreateUser,LogIn,UsersServices};