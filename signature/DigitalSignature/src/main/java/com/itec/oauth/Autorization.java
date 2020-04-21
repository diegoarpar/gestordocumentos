/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.oauth;

import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import io.dropwizard.auth.Authorizer;

import java.util.List;


/**
 *
 * @author iTech-Pc
 */
public class Autorization implements Authorizer<User> {


    @Override
    public boolean authorize(User u, String role) {
        CallServices cs = new CallServices();
        try{
            String rta = cs.callGetServices(u.getAutorization(),UrlFactory.GET_ROLES,null);
            int cont=0;
            if(rta.equals("ERROR"))
            do{
                cont++;
                rta = cs.callGetServices(u.getAutorization(),UrlFactory.GET_ROLES,null);
            }while(rta.equals("ERROR")&&cont<10);
            List<DBObject> roles = (List<DBObject>) JSON.parse(rta);
            String [] rolesToSearch =role.split(",");
            for(int i=0;i<rolesToSearch.length;i++){
                for(int j=0;j<roles.size();j++){
                    if(rolesToSearch[i].equals(roles.get(j).get("rol").toString())){
                        cs=null;
                        return true;
                    }
                }
            }
        }catch (Exception e){

        }
        cs=null;
        return false;
    }
}