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
        collection= Utils.getMongoCollectionName(collection,tenant);
        ConfigurationApp.getMongoClient(tenant).getCollection(collection).insert(criterial);
        return JSON.parse("{'flag':1,'message':'Elimiando'}");

    }
    public static Object update(String collection, BasicDBObject criterial,BasicDBObject newData, String tenant) throws IOException {
        collection= Utils.getMongoCollectionName(collection,tenant);
        ConfigurationApp.getMongoClient(tenant).getCollection(collection).update(criterial,newData);
        return  JSON.parse("{'flag':1,'message':'Elimiando'}");

    }
    public static Object remove(String collection, BasicDBObject criterial,String tenant) throws IOException {
        collection= Utils.getMongoCollectionName(collection,tenant);
        ConfigurationApp.getMongoClient(tenant).getCollection(collection).remove(criterial);

        return JSON.parse("{'flag':1,'message':'Elimiando'}");
    }

    public static List<DBObject> find(String collection, BasicDBObject criterial,String tenant) throws IOException {
        collection= Utils.getMongoCollectionName(collection,tenant);
        DBCursor curs;
        curs= ConfigurationApp.getMongoClient(tenant).getCollection(collection).find(criterial);
        return curs.toArray();
    }



}
