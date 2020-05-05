import React,{useState,useEffect} from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import axios from "axios";



function  UsersServices  () {
    
   
}
async function  GetData(){
    return axios.get("http://localhost:5000/authentication/users/")
    .then(data =>{
        return data.data
    })
}

async function  CreateUser(data){
    return axios.post("http://localhost:5000/authentication/users/",data)
    .then(data =>{
        return data.data
    })
}

export default  {GetData,CreateUser,UsersServices};