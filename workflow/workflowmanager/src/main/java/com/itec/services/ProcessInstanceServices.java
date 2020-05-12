package com.itec.services;

import com.itec.configuration.ConfigurationApp;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

@Path("/workflow/")
public class ProcessInstanceServices {
    @GET
    @Path("/greeting")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public String greeting(@Context HttpServletRequest req) {
        return "Hello worold greeting";
    }
    @GET
    @Path("/helloworld")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public String helloworld(@Context HttpServletRequest req) throws IOException {
        ConfigurationApp.initProcessEngine("gestorbancoa");
        return "Hello worold helloworld";
    }
}

