package com.data.ldap.user.config;

import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.boot.autoconfigure.ldap.LdapProperties;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
@ComponentScan("com.data.ldap.user")
@PropertySource("classpath:application-user-ldap.properties")
@Import(UtilSecretsConfiguration.class)
public class DataLdapUsersConfigurationApp {

    private final Environment environment;
    public DataLdapUsersConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean
    public LdapContextSource contextSource(LdapProperties props) {
        LdapContextSource source = new LdapContextSource();
        source.setUrl(environment.getRequiredProperty("authentication.ldap.url"));
        source.setBase(environment.getRequiredProperty("authentication.ldap.base"));
        source.setUserDn(environment.getRequiredProperty("authentication.ldap.user.dn"));
        source.setPassword(environment.getRequiredProperty("authentication.ldap.password"));
        return source;
    }
}
