package com.itec.api.authentication.configuration;

import com.data.user.config.DataUsersConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
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
@Import({DataUsersConfigurationApp.class,
        UtilAuthorizationConfiguration.class,
        UtilCryptoConfiguration.class,
        UtilSecretsConfiguration.class})
@PropertySource("classpath:api-authentication.properties")
public class ApiAuthenticationConfiguration {
    private final Environment environment;

    public ApiAuthenticationConfiguration(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean
    public CryptoUtil cryptoUtil(@Value("${authentication.crypto.secret}") String cryptoSecret) {
        return CryptoUtil.builder().secret(cryptoSecret).build();
    }
}
