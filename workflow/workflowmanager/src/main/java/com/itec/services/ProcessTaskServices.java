package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.itec.util.Utils;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/processTask/")
public class ProcessTaskServices {

    String collectionInstanceInformation="taksInformation";

    @POST
    @Path("/getTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<BasicDBObject> getTask(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        BasicDBList roles = (BasicDBList) criterial.get("roles");
        List<BasicDBObject> rta = new ArrayList<BasicDBObject>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);
        TaskService taskService = pe.getTaskService();

        List<Task> taks = new ArrayList<Task>();
        taks.addAll(taskService.createTaskQuery()
                .taskAssignee(criterial.get("user").toString()).list());
        for(int i=0;i<roles.size();i++){
            String role= roles.get(i).toString();
            taks.addAll(taskService.createTaskQuery()
                    .taskCandidateGroup(role).list());
        }

        for (int i = 0; i < taks.size(); i++) {
            BasicDBObject item = new BasicDBObject();
            Task task = taks.get(i);
            item.append("taskName",task.getName())
                    .append("taskId",task.getId())
                    .append("dueDate",task.getDueDate())
                    .append("processKey",task.getProcessDefinitionId())
                    .append("processInstance",task.getProcessInstanceId());
            rta.add(item);
        }
        pe.close();
        return rta;
    }
}

