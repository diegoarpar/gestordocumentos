package com.itec.workflow;


import com.itec.configuration.ConfigurationApp;
import com.itec.services.ProcessDefinitionServices;
import com.itec.services.ProcessInstanceServices;
import com.itec.services.ProcessTaskServices;
import io.dropwizard.Application;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.client.filter.EncodingFilter;
import org.glassfish.jersey.message.GZipEncoder;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

public class Worflow extends Application<ConfigurationApp> {

    public static void main (String[] args) throws Exception{
        if(args.length > 0) new Worflow().run(args);
        else{
            System.out.println(System.getProperty("user.dir"));
            new Worflow().run(new String[] { "server","src/main/java/config/config.yml" });
        }
    }

    @Override
    public void initialize(Bootstrap<ConfigurationApp> bootstrap) {
        bootstrap.addBundle(new MultiPartBundle());
    }

    @Override
    public void run(ConfigurationApp t, Environment e) throws Exception {

        configureCors(e);

        e.jersey().register(GZipEncoder.class);
        e.jersey().register(EncodingFilter.class);
        e.jersey().register(RolesAllowedDynamicFeature.class);
        e.jersey().register(ProcessInstanceServices.class);
        e.jersey().register(ProcessDefinitionServices.class);
        e.jersey().register(ProcessTaskServices.class);
    }

    private void configureCors(Environment e) {
        final FilterRegistration.Dynamic corsFilter = e.servlets().addFilter("CORS", CrossOriginFilter.class);
        corsFilter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM,
                "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,Tenant,Authentication,Referer");
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS");
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        corsFilter.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");



    }
}
