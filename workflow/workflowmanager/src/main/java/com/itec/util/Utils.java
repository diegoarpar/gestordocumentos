package com.itec.util;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.io.*;
import java.util.*;

public class Utils {
    String result = "";
    InputStream inputStream;
    public  HashMap getTenantProperties(String tenant) throws IOException {

        HashMap<String,String> map;
        map = new HashMap<String, String>();
        try {
            Properties prop = new Properties();
            String propFileName = "config.properties";

            inputStream = getClass().getClassLoader().getResourceAsStream(tenant+"_"+propFileName);

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
    public static void writeToFile(InputStream uploadedInputStream, String uploadedFileLocation) throws IOException {
        int read;
        final int BUFFER_LENGTH = 1024;
        final byte[] buffer = new byte[BUFFER_LENGTH];
        OutputStream out = new FileOutputStream(new File(uploadedFileLocation));
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
}
