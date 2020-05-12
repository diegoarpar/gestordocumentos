package com.itec.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;

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


        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            inputStream.close();
        }
        return map;
    }


}
