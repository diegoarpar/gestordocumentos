package com.itec.api.authorization.configuration;

import com.data.authorization.configuration.DataAuthorizationConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.jwt.services.configuration.UtilJwtConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

/**
 * API authentication configuration.
 *
 * @author diegoarpar
 */
@ComponentScan("com.itec.api.authorization")
@Configuration
@Import({DataAuthorizationConfigurationApp.class, UtilCryptoConfiguration.class, UtilAuthorizationConfiguration.class, UtilJwtConfiguration.class})
@PropertySource("classpath:api-authorization.properties")
public class ApiAuthorizationConfiguration {

    private final Environment environment;
    public ApiAuthorizationConfiguration(Environment environment) {
        this.environment = environment;

    }

    @Bean
    public CryptoUtil cryptoUtil() {
        return CryptoUtil.builder().secret(environment.getRequiredProperty("secret.key.crypto")).build();
    }
}
