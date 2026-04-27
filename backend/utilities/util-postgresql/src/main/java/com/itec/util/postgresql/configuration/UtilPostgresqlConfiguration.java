package com.itec.util.postgresql.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.*;

@Configuration
@ComponentScan(basePackages = "com.itec.util.postgresql")
@PropertySource("classpath:util-postgresql.properties")
@Slf4j
public class UtilPostgresqlConfiguration {

}
