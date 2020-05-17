/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.configuration;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.itec.util.Utils;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import io.dropwizard.Configuration;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;

import javax.validation.constraints.NotEmpty;
import java.io.IOException;
import java.util.HashMap;

public class ConfigurationApp extends Configuration {

    @NotEmpty
    private static String resourcesLocation = "config/";

    @JsonProperty
    public static String getResourcesLocation() {
        return resourcesLocation;
    }

    @JsonProperty
    public void setResourcesLocation(String value) {
        this.resourcesLocation = value;
    }
    public static ProcessEngine initProcessEngine(String tenant) throws IOException {

        HashMap map = Utils.getTenantProperties(tenant);
         ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                .setJdbcUrl(map.get("databaseActivitiUrl").toString())
                .setJdbcUsername(map.get("databaseActivitiUser").toString())
                .setJdbcPassword(map.get("databaseActivitiPassword").toString())
                .setJdbcDriver(map.get("databaseActivitiDriver").toString())
                .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
        ProcessEngine processEngine = cfg.buildProcessEngine();
        String pName = processEngine.getName();
        String ver = ProcessEngine.VERSION;
        System.out.println("ProcessEngine [" + pName + "] Version: [" + ver + "]");
        return processEngine;
    }
    public static DB getMongoClient(String tenant) throws IOException {

        String mongoJDBC=Utils.getTenantProperties(tenant).get("databaseMongoUrl").toString();
        String mongoDB=Utils.getTenantProperties(tenant).get("databaseMongoDataBase").toString();
        return new MongoClient(new MongoClientURI(mongoJDBC)).getDB(mongoDB);

    }
}