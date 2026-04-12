package com.itec.util.crypto.configuration;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.security.Security;

@Configuration
@ComponentScan(basePackages = "com.itec.util.crypto")
public class UtilCryptoConfiguration {
    private final Environment environment;

    public UtilCryptoConfiguration(Environment environment) {
        this.environment = environment;
        Security.addProvider(new BouncyCastleProvider());
    }
}
