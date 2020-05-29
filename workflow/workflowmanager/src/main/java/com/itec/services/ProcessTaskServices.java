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

@Path("/workflowmanager/processTask/")
public class ProcessTaskServices {

    String collectionTaksInformation="taksInformation";
    String collectionInstanceInformation="instanceInformation";

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
            BasicDBObject criterial2 =new BasicDBObject().append("processInstanceId",task.getProcessInstanceId());
            List<DBObject> instanceInformation = DBMongo.find(collectionInstanceInformation,criterial2,tenant,false);
            String processName="NoNAME";
            String workflowName="NoNAME";
            if(instanceInformation.size()>0) {
                processName = ((DBObject) instanceInformation.get(0)).get("processName").toString();
                workflowName = ((DBObject) instanceInformation.get(0)).get("workflowName").toString();
            }

            item.append("taskDescription",task.getName())
                    .append("taskId",task.getId())
                    .append("taskName",task.getTaskDefinitionKey())
                    .append("processInstance",task.getProcessInstanceId())
                    .append("dueDate",task.getDueDate())
                    .append("processDefKey",task.getProcessDefinitionId())
                    .append("priority",task.getPriority())
                    .append("assign",task.getAssignee())
                    .append("processName",processName)
                    .append("workflowName",workflowName)
                    .append("processInstanceId",task.getProcessInstanceId());
            rta.add(item);
        }
        pe.close();
        return rta;
    }
    @POST
    @Path("/completeTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<BasicDBObject> completeTask(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        String taskId=criterial.get("taskId").toString();
        String userTakeTask=criterial.get("user").toString();

        List<BasicDBObject> rta = new ArrayList<BasicDBObject>();

        Map<String,Object> inputValues = new HashMap<String,Object>();
        Utils.getProcessInputValues(inputValues,criterial);
        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);
        TaskService ts=pe.getTaskService();
        ts.setAssignee(taskId,userTakeTask);
        ts.complete(taskId,inputValues);
        criterial.append("action","completeTask");
        DBMongo.insert(collectionTaksInformation,criterial,tenant);

        pe.close();
        return rta;
    }
    @POST
    @Path("/assign")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<BasicDBObject> assign(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        BasicDBList data = (BasicDBList) criterial.get("data");
        String taskId=criterial.get("taskId").toString();
        String userTakeTask=criterial.get("user").toString();
        List<BasicDBObject> rta = new ArrayList<BasicDBObject>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);
        TaskService ts=pe.getTaskService();
        ts.setAssignee(taskId,userTakeTask);
        criterial.append("action","assign");
        DBMongo.insert(collectionTaksInformation,criterial,tenant);

        pe.close();
        return rta;
    }
}

