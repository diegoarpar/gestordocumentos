import com.itec.configuration.ConfigurationApp;
import com.itec.sign.Sign;
import com.itextpdf.signatures.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.*;
import java.security.cert.Certificate;



public class TestSignature {

    //@Test
    public void testSignature() throws IOException, GeneralSecurityException {
        String path=ConfigurationApp.UPLOAD_FILE_PATH;
        String password="password";
        path="D:\\temp\\";
        String p12Path="D:\\Descargas\\key.p12";
        System.out.println("test signature "+path);


        String SRC = "D:\\Descargas\\test.pdf";
        String TEMP = path+"Cred_CNUE_0320_S.pdf";

        char[] pass = password.toCharArray();
        File file = new File(path);
        file.mkdirs();

        BouncyCastleProvider provider = new BouncyCastleProvider();
        Security.addProvider(provider);

        KeyStore ks = KeyStore.getInstance("pkcs12", provider.getName());
        ks.load(new FileInputStream(p12Path), pass);
        String alias = ks.aliases().nextElement();
        PrivateKey pk = (PrivateKey) ks.getKey(alias, pass);
        Certificate[] chain = ks.getCertificateChain(alias);

        Sign.sign(SRC, TEMP , chain, pk,
                DigestAlgorithms.SHA256, provider.getName(), PdfSigner.CryptoStandard.CMS,
                "Test", "Ghent", null, null, null, 0);
    }


}
