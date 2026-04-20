package com.itec.api.authorization.configuration;

import com.data.authorization.configuration.DataAuthorizationConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.jwt.services.configuration.UtilJwtConfiguration;
import com.itec.util.jwt.services.helper.JWTUtil;
import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

/**
 * API authentication configuration.
 *
 * @author diegoarpar
 */
@ComponentScan("com.itec.api.authorization")
@Configuration
@Import({DataAuthorizationConfigurationApp.class, UtilCryptoConfiguration.class,
        UtilAuthorizationConfiguration.class, UtilJwtConfiguration.class,
        UtilSecretsConfiguration.class})
@PropertySource("classpath:api-authorization.properties")
public class ApiAuthorizationConfiguration {

    private final Environment environment;
    public ApiAuthorizationConfiguration(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean
    public CryptoUtil cryptoUtil() {
        return CryptoUtil.builder().secret(environment.getRequiredProperty("authorization.secret.key.crypto")).build();
    }


    @Bean
    public JWTUtil jwtUtil() {
        return JWTUtil.builder()
                    .cryptoUtil(cryptoUtil())
                    .ttl(environment.getRequiredProperty("authorization.jwt.ttl"))
                    .secret(environment.getRequiredProperty("authorization.jwt.secret"))
                .build();
    }
}
