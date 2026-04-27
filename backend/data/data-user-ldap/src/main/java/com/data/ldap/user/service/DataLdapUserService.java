package com.data.ldap.user.service;

import com.itec.utilities.model.BaseAuthenticationStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.AuthenticationException;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQueryBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataLdapUserService implements BaseAuthenticationStrategy {

    private final LdapTemplate ldapTemplate;
    private final LdapShaPasswordEncoder ldapShaPasswordEncoder;

    @Override
    public boolean authenticate(String username, String password) {
        try {
            var finalPassword = ldapShaPasswordEncoder.encode(password);
            ldapTemplate.authenticate(
                    LdapQueryBuilder.query()
                            .where("uid").is(username),
                    password
            );
            return true;
        } catch (AuthenticationException exception) {
            log.error("Error", exception);
            return false;
        }
    }
}
