package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.util.Utils;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.util.ResourceBundle;

@Path("/workflowmanager/processDefinition/")
public class ProcessDefinitionServices {

    @POST
    @Path("/uploadProcessDefinition")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String uploadProcessDefinition(@Context HttpServletRequest req,
                             @FormDataParam("file") InputStream uploadedInputStream,
                             @FormDataParam("file") FormDataContentDisposition fileDetail,
                             @FormDataParam("fileName") String fileName

    ) throws IOException {
        Utils utils = new Utils();
        String tenant = Utils.getTenant(req);
        String location = utils.getTenantProperties(tenant).get("tempProcesssLocation").toString()+fileDetail.getFileName();
        Utils.writeToFile(uploadedInputStream, location);

        ProcessEngine pe =ConfigurationApp.initProcessEngine(tenant);
        RepositoryService repositoryService = pe.getRepositoryService();
        Deployment deployment = repositoryService.createDeployment()
                .addClasspathResource(fileDetail.getFileName()).deploy();
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId()).singleResult();
        System.out.println(
                "Found process definition ["
                        + processDefinition.getName() + "] with id ["
                        + processDefinition.getId() + "]");
        pe.close();
        return "Resource located";
    }


}

