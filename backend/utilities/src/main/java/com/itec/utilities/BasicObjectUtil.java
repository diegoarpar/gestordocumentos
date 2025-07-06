package com.itec.utilities;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public class BasicObjectUtil {

    public static String getTenant(HttpServletRequest req) {
        try {
            return req.getHeader("Tenant");
        } catch (Exception e) {
            return "";
        }
    }

     public static String getMongoCollectionName (String collection, String tenant) {
        return tenant+"_"+collection;

    }
    public static void getProcessInputValues(Map<String,Object> inputValues , BasicDBObject criterial){
        BasicDBList variables = (BasicDBList) criterial.get("processVariable");
        BasicDBObject data = (BasicDBObject) criterial.get("data");
        if (variables!=null){
            for (Object variable : variables) {
                String variableName = ((BasicDBObject) variable).get("name").toString();
                String value = data.get(variableName).toString();
                inputValues.put(variableName, value);

            }
        }

    }
}
