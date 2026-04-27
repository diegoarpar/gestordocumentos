package com.data.ldap.user.service;

import org.springframework.stereotype.Component;

@Component
public class LdapShaPasswordEncoder {
    private final Digest digest;
    private final String prefix;

    public LdapShaPasswordEncoder(@Value("${auth.ldap.password-scheme:SSHA-256}") String scheme) {
        this.prefix = "{" + scheme.toUpperCase() + "}";
        this.digest = switch (scheme.toUpperCase()) {
            case "SHA"      -> new SHA1Digest();
            case "SHA-256"  -> new SHA256Digest();
            case "SHA-512"  -> new SHA512Digest();
            case "SSHA"     -> new SHA1Digest();
            case "SSHA-256" -> new SHA256Digest();
            case "SSHA-512" -> new SHA512Digest();
            default -> throw new IllegalArgumentException("Unknown scheme: " + scheme);
        };
    }
}
