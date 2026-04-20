package com.itec.util.secret.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.*;

@Configuration
@ComponentScan(basePackages = "com.itec.util.secret")
@PropertySource("classpath:util-secret.properties")
@Slf4j
public class UtilSecretsConfiguration {


}
