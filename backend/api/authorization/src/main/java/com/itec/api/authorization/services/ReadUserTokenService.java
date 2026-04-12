package com.itec.api.authorization.services;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.model.TokenServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import java.io.UnsupportedEncodingException;
import java.util.Base64;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class ReadUserTokenService implements BaseService<TokenServiceRequest, TokenServiceResponse> {

    Cipher decrypt;
    Cipher encrypt;
    public ReadUserTokenService(@Qualifier("Decrypt") Cipher decrypt,
                                @Qualifier("Encrypt") Cipher encrpyt) throws IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {
        byte[] cipherText = encrpyt.doFinal("Hello World".getBytes());
        var encryptedText = Base64.getEncoder().encodeToString(cipherText);

        var decodeText = Base64.getDecoder().decode(encryptedText);
        System.out.println(cipherText.toString());
        var decrypted = new String(decrypt.doFinal(decodeText), "UTF-8");
        System.out.println(decrypted);
    }

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public TokenServiceResponse execute(TokenServiceRequest information) {
        return new TokenServiceResponse();
    }
}
