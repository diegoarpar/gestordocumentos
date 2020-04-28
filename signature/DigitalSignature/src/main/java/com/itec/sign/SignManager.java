package com.itec.sign;

import com.itec.configuration.ConfigurationApp;
import com.itextpdf.signatures.DigestAlgorithms;
import com.itextpdf.signatures.PdfSigner;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.File;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.Certificate;

import com.itec.configuration.ConfigurationApp;
import com.itec.db.FactoryMongo;
import com.itec.oauth.CallServices;
import com.itec.util.UTILS;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

public class SignManager {

    public static void signP12(String fileLocation) throws  Exception {
        String password = ConfigurationApp.P12PASSWORD;
        String p12Path = ConfigurationApp.P12LOCATION;


        String SRC = fileLocation;
        String TEMP = fileLocation + "signed.pdf";

        char[] pass = password.toCharArray();

        BouncyCastleProvider provider = new BouncyCastleProvider();
        Security.addProvider(provider);

        KeyStore ks = KeyStore.getInstance("pkcs12", provider.getName());
        ks.load(new FileInputStream(p12Path), pass);
        String alias = ks.aliases().nextElement();
        PrivateKey pk = (PrivateKey) ks.getKey(alias, pass);
        Certificate[] chain = ks.getCertificateChain(alias);

        Sign.sign(SRC, TEMP, chain, pk,
                DigestAlgorithms.SHA256, provider.getName(), PdfSigner.CryptoStandard.CMS,
                "Test", "Ghent", null, null, null, 0);
    }
}
