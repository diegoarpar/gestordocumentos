/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.signature;

import com.itec.configuration.ConfigurationApp;
import com.itec.services.*;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

import java.util.EnumSet;
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.message.GZipEncoder;
import org.glassfish.jersey.server.filter.EncodingFilter;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

/**
 *
 * @author iTech-Pc
 */
public class Signature extends  Application<ConfigurationApp> {

       public static void main (String[] args) throws Exception{

       if(args.length > 0) new Signature().run(args);
       else{
           System.out.println(System.getProperty("user.dir"));
        new Signature().run(new String[] { "server","DigitalSignature/src/main/java/com/itec/signature/configSignature.yml" });
       }
    }


    @Override
    public void run(ConfigurationApp t, Environment e) throws Exception {

           configureCors(e);

        e.jersey().register(MultiPartFeature.class);
        e.jersey().register(UploadServices.class);
        e.jersey().register(GZipEncoder.class);
        e.jersey().register(EncodingFilter.class);


        /*e.jersey().register(new AuthDynamicFeature(
        new OAuthCredentialAuthFilter.Builder<User>()
            .setAuthenticator(new Autenticator())
            .setAuthorizer(new Autorization())
            .setPrefix("Bearer")
            .buildAuthFilter()));
        */
        e.jersey().register(RolesAllowedDynamicFeature.class);
    }

    private void configureCors(Environment e) {
        FilterRegistration.Dynamic filter = e.servlets().addFilter("CORSFilter", CrossOriginFilter.class);
        filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, e.getApplicationContext().getContextPath() + "*");
        filter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS");
        filter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        filter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "Origin, Content-Type, Accept, Authorization, Accept-Encoding");
        filter.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");

       }
}


