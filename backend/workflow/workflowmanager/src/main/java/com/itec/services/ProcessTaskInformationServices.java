package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.itec.util.Utils;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/workflowmanager/processTaskInformation/")
public class ProcessTaskInformationServices {

    String collectionTaksInformation="taksInformation";
    String collectionInstanceInformation="instanceInformation";

    @POST
    @Path("/getTaskInformation")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<DBObject>  completeTask(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        return DBMongo.find(collectionTaksInformation,criterial,tenant,true);
    }

}

