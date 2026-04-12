package com.itec.api.authentication.configuration;

import com.data.user.config.DataUsersConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

/**
 * API authentication configuration.
 *
 * @author diegoarpar
 */
@ComponentScan("com.itec.api.authentication")
@Configuration
@Import({DataUsersConfigurationApp.class, UtilAuthorizationConfiguration.class, UtilCryptoConfiguration.class})
@PropertySource("classpath:api-authentication.properties")
public class ApiAuthenticationConfiguration {
    private final Environment environment;

    public ApiAuthenticationConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public CryptoUtil cryptoUtil(@Value("${crypto.secret}") String cryptoSecret) {
        return CryptoUtil.builder().secret(cryptoSecret).build();
    }
}
