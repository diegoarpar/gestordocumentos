/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.db;

import com.itec.configuration.ConfigurationApp;
import com.itec.util.Utils;
import com.mongodb.*;
import com.mongodb.util.JSON;

import java.io.IOException;
import java.util.*;

/**
 *
 * @author iTech-Pc
 */

public class DBMongo {
    public static Object insert(String collection, BasicDBObject criterial, String tenant) throws IOException {
        DB db =ConfigurationApp.getMongoClient(tenant);
        collection= Utils.getMongoCollectionName(collection,tenant);
        db.getCollection(collection).insert(criterial);
        db.getMongo().close();
        db=null;
        return JSON.parse("{'flag':1,'message':'Elimiando'}");

    }
    public static Object update(String collection, BasicDBObject criterial,BasicDBObject newData, String tenant) throws IOException {
        DB db =ConfigurationApp.getMongoClient(tenant);
        collection= Utils.getMongoCollectionName(collection,tenant);
        db.getCollection(collection).update(criterial,newData);
        db.getMongo().close();
        db=null;
        return  JSON.parse("{'flag':1,'message':'Elimiando'}");

    }
    public static Object remove(String collection, BasicDBObject criterial,String tenant) throws IOException {
        DB db =ConfigurationApp.getMongoClient(tenant);
        collection= Utils.getMongoCollectionName(collection,tenant);
        db.getCollection(collection).remove(criterial);
        db.getMongo().close();
        db=null;
        return JSON.parse("{'flag':1,'message':'Elimiando'}");
    }

    public static List<DBObject> find(String collection, BasicDBObject criterial,String tenant, Boolean latest) throws IOException {
        DB db =ConfigurationApp.getMongoClient(tenant);
        collection= Utils.getMongoCollectionName(collection,tenant);
        DBCursor curs=null;
        if(latest==true){
            curs = db.getCollection(collection).find(criterial).sort(new BasicDBObject("_id",-1)).limit(1);
        }else {
            curs = db.getCollection(collection).find(criterial);
        }
        List<DBObject> rta=curs.toArray();
        db.getMongo().close();
        db=null;
        return rta;
    }




}
