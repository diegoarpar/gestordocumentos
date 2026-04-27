package com.data.ldap.user.service;

import org.bouncycastle.crypto.Digest;
import org.bouncycastle.crypto.digests.*;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;

@Component
public class LdapShaPasswordEncoder {
    private final String prefix;
    private final Environment environment;


    private static final Map<String, Digest> PREFIX_TO_DIGEST = Map.of(
            "{SHA}",      new SHA1Digest(),
            "{SHA-256}",  new SHA256Digest(),
            "{SHA-512}",  new SHA512Digest(),
            "{SSHA}",     new SHA1Digest(),
            "{SSHA-256}", new SHA256Digest(),
            "{SSHA-512}", new SHA512Digest()
    );

    public LdapShaPasswordEncoder(Environment environment) {
        this.environment = environment;
        var scheme = environment.getRequiredProperty("authentication.ldap.scheme.password");
        this.prefix = "{" + scheme.toUpperCase() + "}";
    }

    private GeneralDigest getDigest() {
        var scheme = environment.getRequiredProperty("authentication.ldap.scheme.password");
        return switch (scheme.toUpperCase()) {
            case "SHA"      -> new SHA1Digest();
            case "SHA-256"  -> new SHA256Digest();
            case "SSHA"     -> new SHA1Digest();
            case "SSHA-256" -> new SHA256Digest();
            default -> throw new IllegalArgumentException("Unknown scheme: " + scheme);
        };
    }

    private LongDigest getLongDigest() {
        var scheme = environment.getRequiredProperty("authentication.ldap.scheme.password");
        return switch (scheme.toUpperCase()) {
            case "SHA-512"  -> new SHA512Digest();
            case "SSHA-512" -> new SHA512Digest();
            default -> throw new IllegalArgumentException("Unknown scheme: " + scheme);
        };
    }

    public String encodeWithSalt(CharSequence raw) {
        // Default to SSHA-256 for new passwords
        SHA256Digest digest = new SHA256Digest();
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        byte[] input = concat(raw.toString().getBytes(StandardCharsets.UTF_8), salt);
        digest.update(input, 0, input.length);
        byte[] hash = new byte[digest.getDigestSize()];
        digest.doFinal(hash, 0);
        return "{SSHA-256}" + Base64.getEncoder().encodeToString(concat(hash, salt));
    }

    public String encode(CharSequence raw) {
        // Default to SSHA-256 for new passwords
        var digest = new SHA512Digest();
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        byte[] input = concat(raw.toString().getBytes(StandardCharsets.UTF_8), salt);
        digest.update(input, 0, input.length);
        byte[] hash = new byte[digest.getDigestSize()];
        digest.doFinal(hash, 0);
        return "{SSHA-512}" + Base64.getEncoder().encodeToString(concat(hash, salt));
    }

    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        String prefix = extractPrefix(encodedPassword);
        Digest digest = PREFIX_TO_DIGEST.get(prefix.toUpperCase());

        if (digest == null)
            throw new IllegalArgumentException("Unsupported scheme: " + prefix);

        boolean salted = prefix.toUpperCase().contains("SSHA");
        byte[] decoded = Base64.getDecoder().decode(encodedPassword.substring(prefix.length()));

        byte[] storedHash, salt;
        if (salted) {
            int hashLen = digest.getDigestSize();
            storedHash = Arrays.copyOfRange(decoded, 0, hashLen);
            salt = Arrays.copyOfRange(decoded, hashLen, decoded.length);
        } else {
            storedHash = decoded;
            salt = new byte[0];
        }

        // Let Bouncy Castle do the hashing
        byte[] input = concat(rawPassword.toString().getBytes(StandardCharsets.UTF_8), salt);
        digest.update(input, 0, input.length);
        byte[] computed = new byte[digest.getDigestSize()];
        digest.doFinal(computed, 0);

        return MessageDigest.isEqual(storedHash, computed);
    }

    private String extractPrefix(String encoded) {
        int end = encoded.indexOf('}');
        if (end == -1) throw new IllegalArgumentException("No prefix found in: " + encoded);
        return encoded.substring(0, end + 1);
    }

    private byte[] concat(byte[] a, byte[] b) {
        byte[] r = new byte[a.length + b.length];
        System.arraycopy(a, 0, r, 0, a.length);
        System.arraycopy(b, 0, r, a.length, b.length);
        return r;
    }
}
