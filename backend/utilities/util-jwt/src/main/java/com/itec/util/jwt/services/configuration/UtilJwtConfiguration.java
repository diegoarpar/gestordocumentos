package com.itec.util.jwt.services.configuration;

import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

@Configuration
@Import(UtilCryptoConfiguration.class)
@ComponentScan(basePackages = "com.itec.util.jwt")
@PropertySource("classpath:util-jwt.properties")
public class UtilJwtConfiguration {
    private final Environment environment;

    public UtilJwtConfiguration(Environment environment) {
        this.environment = environment;
    }

}
