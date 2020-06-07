package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.DBMongo;
import com.itec.util.Utils;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/workflowmanager/processInstance/")
public class ProcessInstanceServices {

    String collectionInstanceInformation="instanceInformation";
    String collectionTaksInformation="taksInformation";

    @POST
    @Path("/initProcessInstance")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<DBObject> initiProcessInstance(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        Map<String,Object> inputValues = new HashMap<String,Object>();
        Utils.getProcessInputValues(inputValues,criterial);
        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);
        RuntimeService runtimeService = pe.getRuntimeService();
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(criterial.getString("workflowName").toString(),inputValues);
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");
        criterial.append("processInstanceId",processInstance.getProcessInstanceId());
        DBMongo.insert(collectionInstanceInformation,criterial,tenant);
        DBMongo.insert(collectionTaksInformation,criterial,tenant);
        pe.close();
        return DBMongo.find(collectionInstanceInformation,criterial,tenant,false);
    }


    @POST
    @Path("/diagram")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProcessInstanceDiagram(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        String processInstanceId= criterial.get("processInstanceId").toString();
        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);

        RuntimeService runtimeService = pe.getRuntimeService();

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId).singleResult();

        RepositoryService repositoryService = pe.getRepositoryService();
        ProcessDefinition pde = repositoryService.getProcessDefinition(processInstance.getProcessDefinitionId());

        if (pde != null && pde.hasGraphicalNotation()) {

            InputStream diagramStream = new DefaultProcessDiagramGenerator().generateDiagram(repositoryService
                            .getBpmnModel(pde.getId()), "png",
                    runtimeService.getActiveActivityIds(processInstanceId));
            try {
                String imageStr = Base64.getEncoder().encodeToString(IOUtils.toByteArray(diagramStream));
                //return Response.ok().type("image/png").entity(IOUtils.toByteArray(diagramStream)).build();
                return Response.ok().type("image/png").entity(imageStr).build();
            } catch (Exception e) {
                throw new ActivitiIllegalArgumentException("Error exporting diagram", e);
            }

        } else {
            throw new ActivitiIllegalArgumentException("Process instance with id '" + processInstance.getId()
                    + "' has no graphical notation defined.");
        }
    }


    @POST
    @Path("/getHistory")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<DBObject> getHistory(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        return DBMongo.find(collectionInstanceInformation,criterial,tenant,false);
    }

}

