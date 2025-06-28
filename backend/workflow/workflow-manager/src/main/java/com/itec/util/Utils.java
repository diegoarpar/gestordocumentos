package com.itec.util;

import com.itec.configuration.ConfigurationApp;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.io.*;
import java.util.*;

public class Utils {

    public static String getProcessPath(String tenant) throws IOException {
        return ConfigurationApp.getResourcesLocation()
                +tenant+"/processes/";
    }

    public static HashMap getTenantProperties(String tenant) throws IOException {
        InputStream  inputStream=null;
        HashMap<String,String> map;
        map = new HashMap<String, String>();
        try {
            Properties prop = new Properties();
            String propFileName = "config.properties";

            String location = ConfigurationApp.getResourcesLocation()+ tenant+"_"+propFileName;
            inputStream= new FileInputStream(new File(location));

            if (inputStream != null) {
                prop.load(inputStream);
            } else {
                throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
            }

            Date time = new Date(System.currentTimeMillis());

            // get the property value and print it out
            map.put("databaseActivitiDriver", prop.getProperty("databaseActivitiDriver"));
            map.put("databaseActivitiUser", prop.getProperty("databaseActivitiUser"));
            map.put("databaseActivitiPassword", prop.getProperty("databaseActivitiPassword"));
            map.put("databaseActivitiUrl", prop.getProperty("databaseActivitiUrl"));
            map.put("tempProcesssLocation", prop.getProperty("tempProcesssLocation"));
            map.put("databaseMongoUrl", prop.getProperty("databaseMongoUrl"));
            map.put("databaseMongoDataBase", prop.getProperty("databaseMongoDataBase"));



        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            inputStream.close();
        }
        return map;
    }
    public static void writeToFile(InputStream uploadedInputStream, String fileName, String uploadedFileLocation) throws IOException {
        int read;
        final int BUFFER_LENGTH = 1024;
        final byte[] buffer = new byte[BUFFER_LENGTH];
        if(new File(uploadedFileLocation).exists()==false)new File(uploadedFileLocation).mkdirs();
        OutputStream out = new FileOutputStream(new File(uploadedFileLocation+fileName));
        while ((read = uploadedInputStream.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
        out.flush();
        out.close();
    }

    public static String getTenant(@Context HttpServletRequest req) {
        try {
            return req.getHeader("Tenant");
        } catch (Exception e) {
            return "";
        }
    }

    public static BasicDBObject fillStringFromRequestPost (@Context HttpServletRequest req) throws IOException {
        req.getParameterMap();
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
        String read;
        while ((read = br.readLine()) != null) {
            stringBuilder.append(read);
        }
        br.close();
        return (BasicDBObject) JSON.parse(stringBuilder.toString());

    }
    public static String getMongoCollectionName (String collection, String tenant) {
        return tenant+"_"+collection;

    }
    public static void getProcessInputValues(Map<String,Object> inputValues , BasicDBObject criterial){
        BasicDBList variables = (BasicDBList) criterial.get("processVariable");
        BasicDBObject data = (BasicDBObject) criterial.get("data");
        if(variables!=null){
            for(int i=0; i<variables.size();i++){
                String variableName=((BasicDBObject)variables.get(i)).get("name").toString();
                String value=data.get(variableName).toString();
                inputValues.put(variableName,value);

            }
        }

    }
}
