package com.itec.services;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.FactoryMongo;
import com.itec.oauth.CallServices;
import com.itec.sign.SignManager;
import com.itec.util.UTILS;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;
import java.net.URLEncoder;
import java.util.*;

/**
 * Created by root on 14/06/16.
 */

@Path("/signer/sign/")
@Produces(MediaType.APPLICATION_JSON)
public class UploadServices {
    HashMap criterial= new HashMap<>();
    @POST
    @Path("/p12server")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response uploadFile(@Context HttpServletRequest req,
            @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("file") FormDataContentDisposition fileDetail,
            @FormDataParam("fileName") String name

            ) throws Exception {

        String folder = ConfigurationApp.UPLOAD_FILE_PATH+"/"+UUID.randomUUID().toString();

        String fileName=fileDetail.getFileName();

        criterial.clear();
        UTILS.getTenant(req,criterial);
        BasicDBObject obj= new BasicDBObject();
        obj.put("fileName",fileName);
        obj.put("fechaCarga",new Date());
        //obj.put("metadata",JSON.parse(metadata));
        UTILS.getTenant(req,criterial);
        UTILS.createFolder(folder);
        String uploadedFileLocation = folder+"/"+fileName;
        UTILS.writeToFile(uploadedInputStream, uploadedFileLocation);
        SignManager.signP12(uploadedFileLocation);

        InputStream stream =new FileInputStream(uploadedFileLocation+"signed.pdf");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int b;
        while ((b = stream.read(buffer)) > -1) {
            baos.write(buffer, 0, b);
        }

        /*return Response
                .ok(baos.toByteArray(),MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition","attachment; filename = \"" + fileName+"\"")
                .build();*/
        //File file = new File(uploadedFileLocation+"signed.pdf");
        File file = new File(uploadedFileLocation+"");
        return Response.ok(file, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"" ) //optional
                .build();
    }

    @GET
    @Path("/getFile")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response uploadFile(@Context HttpServletRequest req

    ) throws Exception {
        criterial=UTILS.fillCriterialFromString(req.getQueryString(),criterial);


        String fileName=((BasicDBObject)criterial.get("json")).get("filename").toString();//fileDetail.getFileName();
        String uploadedFileLocation=((BasicDBObject)criterial.get("json")).get("folder").toString();
        uploadedFileLocation=ConfigurationApp.UPLOAD_FILE_PATH+"\\"+uploadedFileLocation+"\\"+fileName+"signed.pdf";
        criterial.clear();

        InputStream stream =new FileInputStream(uploadedFileLocation);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int b;
        while ((b = stream.read(buffer)) > -1) {
            baos.write(buffer, 0, b);
        }

        /*return Response
                .ok(baos.toByteArray(),MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition","attachment; filename = \"" + fileName+"\"")
                .build();*/
        //File file = new File(uploadedFileLocation+"signed.pdf");
        File file = new File(uploadedFileLocation+"");
        return Response.ok(file, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"" ) //optional
                .build();
    }
  }