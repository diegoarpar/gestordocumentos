package com.itec.api.workflow.configuration;

import com.data.workflow.rd.config.DataWorkflowConfigurationApp;
import com.data.workflow.activity.config.ProcessConfigurationApp;
import com.itec.util.authorization.configuration.UtilAuthorizationConfiguration;
import com.itec.util.authorization.interceptor.UtilUserAuthorizationJwtInterceptor;
import com.itec.util.authorization.services.UtilAuthorizationService;
import com.itec.util.crypto.configuration.UtilCryptoConfiguration;
import com.itec.util.crypto.services.CryptoUtil;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Import({DataWorkflowConfigurationApp.class, ProcessConfigurationApp.class, UtilAuthorizationConfiguration.class, UtilCryptoConfiguration.class})
@PropertySource("classpath:api-workflow.properties")
@ComponentScan("com.itec.api.workflow")
public class ApiWorkflowConfiguration implements WebMvcConfigurer {
    private final Environment environment;
    private final ApiWorkflowProperties apiWorkflowProperties;
    private final UtilAuthorizationService utilAuthorizationService;

    public ApiWorkflowConfiguration(Environment environment, ApiWorkflowProperties apiWorkflowProperties, UtilAuthorizationService utilAuthorizationService) {
        this.environment = environment;
        this.apiWorkflowProperties = apiWorkflowProperties;
        this.utilAuthorizationService = utilAuthorizationService;
    }

    @Bean
    public CryptoUtil cryptoUtil() {
        return CryptoUtil.builder().secret(apiWorkflowProperties.getSecret()).build();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        var interceptor = UtilUserAuthorizationJwtInterceptor.builder()
                .cryptoUtil(cryptoUtil())
                .consumerId(apiWorkflowProperties.getId())
                .utilAuthorizationService(utilAuthorizationService)
            .build();
        registry.addInterceptor(interceptor)
                .addPathPatterns("/**");
    }
}
