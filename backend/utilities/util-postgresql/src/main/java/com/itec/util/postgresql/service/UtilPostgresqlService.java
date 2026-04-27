package com.itec.util.postgresql.service;

import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Properties;


public class UtilPostgresqlService {

    public DataSource postgreSql(Environment environment, String moduleName) {
        var userName = String.format("data.%s.username", moduleName);
        var password = String.format("data.%s.password", moduleName);
        var url = String.format("data.%s.url", moduleName);
        var ds = new DriverManagerDataSource();
        ds.setUrl(environment.getRequiredProperty(url));
        ds.setUsername(environment.getRequiredProperty(userName));
        ds.setPassword(environment.getRequiredProperty(password));
        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }

    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
                                                                       Environment environment,
                                                                       String classPath, String moduleName) {
        var showSql = String.format("data.%s.show-sql", moduleName);
        var dialect = String.format("data.%s.dialect", moduleName);
        var ddl = String.format("data.%s.ddl", moduleName);
        var em =
                new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan(classPath);

        var adapter = new HibernateJpaVendorAdapter();
        adapter.setShowSql(Boolean.parseBoolean(showSql));
        em.setJpaVendorAdapter(adapter);

        var props = new Properties();
        props.put("hibernate.dialect", environment.getRequiredProperty(dialect));
        props.put("hibernate.hbm2ddl.auto", environment.getRequiredProperty(ddl));
        em.setJpaProperties(props);

        return em;
    }

    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean localContainerEntityManagerFactoryBean) {
        JpaTransactionManager tm = new JpaTransactionManager();
        tm.setEntityManagerFactory(localContainerEntityManagerFactoryBean.getObject());
        return tm;
    }
}
