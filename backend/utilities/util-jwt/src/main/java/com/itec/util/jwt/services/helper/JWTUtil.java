package com.itec.util.jwt.services.helper;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.itec.util.crypto.services.CryptoUtil;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Component
public class JWTUtil {

    private final CryptoUtil cryptoUtil;
    private final Algorithm algorithm;
    private final int TTL;
    private final String ISSUER = "COMPANY";


    public JWTUtil(Environment environment, CryptoUtil cryptoUtil) {
        var jwtSecret = environment.getRequiredProperty("secret.key.jwt");
        TTL = environment.getRequiredProperty("ttl.key.jwt", Integer.class);
        this.algorithm = Algorithm.HMAC256(jwtSecret);
        this.cryptoUtil = cryptoUtil;
    }

    public String issueAccessToken(String username, List<String> scopes) {
        var now = Instant.now();

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(username)                        // "sub" claim = username
                .withIssuedAt(Date.from(now))                 // "iat"
                .withNotBefore(Date.from(now))                // "nbf" — not valid before now
                .withExpiresAt(Date.from(now.plusSeconds(TTL))) // "exp"
                .withClaim("scopes", scopes)                  // custom claim: scopes
                .withClaim("token_type", "access")
                .withClaim("userId", cryptoUtil.encrypt(username))
                .sign(algorithm);
    }

    public String issueRefreshToken(String username) {
        var now = Instant.now();

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(username)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plusSeconds(TTL)))
                .withClaim("token_type", "refresh")
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token) {
        var verifier = JWT.require(algorithm)
                .withIssuer(ISSUER)
                .build();

        try {
            return verifier.verify(token);
        } catch (TokenExpiredException e) {
            throw new RuntimeException("Token is expired. Please refresh.", e);
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid token: " + e.getMessage(), e);
        }
    }

    public String renewAccessToken(String refreshToken, List<String> scopes) {
        var decoded = validateToken(refreshToken);

        // Guard: make sure it really is a refresh token
        var tokenType = decoded.getClaim("token_type").asString();
        if (!"refresh".equals(tokenType)) {
            throw new RuntimeException("Expected a refresh token, got: " + tokenType);
        }

        var username = decoded.getSubject();
        return issueAccessToken(username, scopes);
    }

    public boolean hasScope(DecodedJWT token, String requiredScope) {
        var scopes = token.getClaim("scopes").asList(String.class);
        return scopes != null && scopes.contains(requiredScope);
    }

    public boolean isExpired(String token) {
        try {
            var decoded = JWT.decode(token);
            return decoded.getExpiresAt().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
