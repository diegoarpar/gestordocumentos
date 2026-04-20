package com.itec.util.jwt.services.helper;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.itec.util.crypto.services.CryptoUtil;
import lombok.Builder;
import java.time.Instant;
import java.util.Date;
import java.util.List;

public class JWTUtil {

    private final CryptoUtil cryptoUtil;
    private final Algorithm algorithm;
    private final int TTL;
    private final String ISSUER = "COMPANY";

    @Builder
    public JWTUtil(CryptoUtil cryptoUtil, String secret, String ttl) {
        TTL = Integer.parseInt(ttl);
        this.algorithm = Algorithm.HMAC256(secret);
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

    public String renewAccessToken(String refreshToken, String userName, List<String> scopes) {
        var decoded = validateToken(refreshToken);
        return issueAccessToken(userName, scopes);
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
