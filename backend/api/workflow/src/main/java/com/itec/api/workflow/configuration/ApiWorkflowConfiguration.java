package com.itec.api.workflow.configuration;

import com.data.workflow.rd.config.DataWorkflowConfigurationApp;
import com.data.workflow.activity.config.ProcessConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.authorization.interceptor.UtilUserAuthorizationJwtInterceptor;
import com.itec.util.authorization.services.UtilAuthorizationService;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Import({DataWorkflowConfigurationApp.class, ProcessConfigurationApp.class,
        UtilAuthorizationConfiguration.class, UtilCryptoConfiguration.class,
        UtilSecretsConfiguration.class})
@PropertySource("classpath:api-workflow.properties")
@ComponentScan("com.itec.api.workflow")
public class ApiWorkflowConfiguration implements WebMvcConfigurer {
    private final Environment environment;
    private final UtilAuthorizationService utilAuthorizationService;

    @Value("${worfklow.crypto.secret}") String secret;
    @Value("${worfklow.consumer.id}") String consumerId;

    public ApiWorkflowConfiguration(Environment environment,
                                    UtilAuthorizationService utilAuthorizationService,
                                    UtilSecretService utilSecretService) {
        this.environment = environment;
        this.utilAuthorizationService = utilAuthorizationService;
        utilSecretService.loadSecrets();
    }

    @Bean
    public CryptoUtil cryptoUtil() {
        return CryptoUtil.builder().secret(secret).build();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        var interceptor = UtilUserAuthorizationJwtInterceptor.builder()
                .cryptoUtil(cryptoUtil())
                .consumerId(consumerId)
                .utilAuthorizationService(utilAuthorizationService)
            .build();
        registry.addInterceptor(interceptor)
                .addPathPatterns("/**");
    }
}
