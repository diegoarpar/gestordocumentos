package com.itec.utilities;

import jakarta.servlet.http.HttpServletRequest;


public class BasicObjectUtil {

    public static String getTenant(HttpServletRequest req) {
        try {
            return req.getHeader("Tenant");
        } catch (Exception e) {
            return "";
        }
    }

}
