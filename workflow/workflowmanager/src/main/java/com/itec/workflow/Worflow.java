package com.itec.workflow;


import com.itec.configuration.ConfigurationApp;
import com.itec.services.ProcessDefinitionServices;
import com.itec.services.ProcessInstanceServices;
import io.dropwizard.Application;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.glassfish.jersey.client.filter.EncodingFilter;
import org.glassfish.jersey.message.GZipEncoder;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

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



        e.jersey().register(GZipEncoder.class);
        e.jersey().register(EncodingFilter.class);
        e.jersey().register(RolesAllowedDynamicFeature.class);
        e.jersey().register(ProcessInstanceServices.class);
        e.jersey().register(ProcessDefinitionServices.class);
    }


}
