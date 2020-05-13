package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.itec.util.Utils;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/processInstance/")
public class ProcessInstanceServices {

    String collectionInstanceInformation="instanceInformation";
    @GET
    @Path("/greeting")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public String greeting(@Context HttpServletRequest req) {
        return "Hello worold greeting";
    }

    @POST
    @Path("/initProcessInstance")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<DBObject> initiProcessInstance(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        Map<String,Object> inputValues = new HashMap<String,Object>();
        RuntimeService runtimeService = ConfigurationApp.initProcessEngine(tenant).getRuntimeService();
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(criterial.getString("processName").toString(),inputValues);
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");
        criterial.append("procesInstanceId",processInstance.getProcessInstanceId());
        DBMongo.insert(collectionInstanceInformation,criterial,tenant);
        return DBMongo.find(collectionInstanceInformation,criterial,tenant);
    }
}

