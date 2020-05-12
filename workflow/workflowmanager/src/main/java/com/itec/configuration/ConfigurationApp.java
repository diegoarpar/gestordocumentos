/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.configuration;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.itec.util.Utils;
import io.dropwizard.Configuration;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;

import java.io.IOException;
import java.util.HashMap;

public class ConfigurationApp extends Configuration {



    public static ProcessEngine initProcessEngine(String tenant) throws IOException {
        Utils utils = new Utils();
        HashMap map = utils.getTenantProperties(tenant);
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
}