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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Path("/workflowmanager/numberService/")
public class ProcessNumberServices {


    String collectionProcessNumber="processNumber";

    @POST
    @Path("/getProcessNumber")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public DBObject getProcessNumber(@Context HttpServletRequest req) throws IOException {
        String tenant= Utils.getTenant(req);
        BasicDBObject criterial =Utils.fillStringFromRequestPost(req);
        String format = criterial.get("format").toString();
        String display = criterial.get("display").toString();

        DateFormat df = new SimpleDateFormat(format);
        DateFormat displaydf = new SimpleDateFormat(display);
        Date today = null;
        String number = "";
        String displayAsString = "";
        BasicDBObject criterial2=null;
        while(true){
            today = Calendar.getInstance().getTime();
            number = df.format(today);
            displayAsString = displaydf.format(today);
            criterial2 = new BasicDBObject();
            criterial2.append("number",number);
            if(DBMongo.find(collectionProcessNumber,criterial2,tenant,false).size()==0){
                break;
            }
        }
        criterial.append("number",number);
        criterial.append("displayNumber",displayAsString);
        DBMongo.insert(collectionProcessNumber,criterial,tenant);

        return criterial;
    }


}

