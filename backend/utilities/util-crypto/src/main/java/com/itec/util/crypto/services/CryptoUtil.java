package com.itec.util.crypto.services;

import lombok.Builder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.Security;
import java.util.Base64;

public class CryptoUtil {

    private Cipher cipherEncrypt;
    private Cipher cipherDecrypt;

    @Builder
    public CryptoUtil(String secret)  {
        try {
            Security.addProvider(new BouncyCastleProvider());
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            var secretKey = new SecretKeySpec(keyBytes, "AES");

            // Initialize Cipher for CBC mode with PKCS5 padding
            var cipher = Cipher.getInstance("AES/CBC/PKCS5Padding", "BC");
            byte[] iv = new byte[cipher.getBlockSize()]; // Use a secure random IV for real apps
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(iv));
            this.cipherEncrypt = cipher;

            var cipherDecrypt = Cipher.getInstance("AES/CBC/PKCS5Padding", "BC");
            byte[] ivDecrypt = new byte[cipherDecrypt.getBlockSize()]; // Use a secure random IV for real apps
            cipherDecrypt.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(ivDecrypt));
            this.cipherDecrypt = cipherDecrypt;
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }

    }

    public String encrypt(String value) {
        try {
            var encryptedBytes = cipherEncrypt.doFinal(value.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (IllegalBlockSizeException e) {
            throw new RuntimeException(e);
        } catch (BadPaddingException e) {
            return null;
        }
    }

    public String decrypt(String value) {
        try {
            var decodedValue = Base64.getDecoder().decode(value);
            return new String(cipherDecrypt.doFinal(decodedValue), "UTF-8");
        } catch (IllegalBlockSizeException e) {
            return null;
        } catch (BadPaddingException e) {
            return null;
        } catch (UnsupportedEncodingException e) {
            return null;
        }
    }
}
