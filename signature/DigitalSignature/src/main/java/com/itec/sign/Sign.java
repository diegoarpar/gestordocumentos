package com.itec.sign;

import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.StampingProperties;
import com.itextpdf.signatures.*;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.DERObjectIdentifier;
import org.bouncycastle.asn1.DEROctetString;
import org.bouncycastle.asn1.esf.OtherHashAlgAndValue;
import org.bouncycastle.asn1.esf.SignaturePolicyId;
import org.bouncycastle.asn1.esf.SignaturePolicyIdentifier;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.FileOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.Certificate;
import java.util.Collection;

public class Sign {

    public static void sign(String src, String dest, Certificate[] chain, PrivateKey pk,
                            String digestAlgorithm, String provider, PdfSigner.CryptoStandard subfilter,
                            String reason, String location, Collection<ICrlClient> crlList,
                            IOcspClient ocspClient, ITSAClient tsaClient, int estimatedSize)
            throws GeneralSecurityException, IOException {
        PdfReader reader = new PdfReader(src);
        PdfSigner signer = new PdfSigner(reader, new FileOutputStream(dest), new StampingProperties());

        // Create the signature appearance
        //Rectangle rect = new Rectangle(36, 648, 200, 100);
        //PdfSignatureAppearance appearance = signer.getSignatureAppearance();
        //appearance
        //        .setReason(reason)
        //        .setLocation(location);

                // Specify if the appearance before field is signed will be used
                // as a background for the signed field. The "false" value is the default value.
                //.setReuseAppearance(false);
                //.setPageRect(rect)
                //.setPageNumber(1);
        //signer.setFieldName("sig");

        //IExternalSignature pks = new PrivateKeySignature(pk, digestAlgorithm, provider);


        // Sign the document using the detached mode, CMS or CAdES equivalent.
        String notExistingSignaturePolicyOid = "2.16.724.631.3.1.124.2.29.9";
        DERObjectIdentifier asn1PolicyOid = (DERObjectIdentifier) DERObjectIdentifier.getInstance(new DERObjectIdentifier(notExistingSignaturePolicyOid));
        AlgorithmIdentifier hashAlg = new AlgorithmIdentifier(DERObjectIdentifier.getInstance(new ASN1ObjectIdentifier(DigestAlgorithms.getAllowedDigest("SHA1"))));
        IExternalSignature pks = new PrivateKeySignature(pk, DigestAlgorithms.SHA256, BouncyCastleProvider.PROVIDER_NAME);

        // indicate that the policy hash value is not known; see ETSI TS 101 733 V2.2.1, 5.8.1
        byte[] zeroSigPolicyHash = {0};
        DEROctetString hash = new DEROctetString(zeroSigPolicyHash);

        SignaturePolicyId signaturePolicyId = new SignaturePolicyId(asn1PolicyOid, new OtherHashAlgAndValue(hashAlg, hash));
        SignaturePolicyIdentifier sigPolicyIdentifier = new SignaturePolicyIdentifier(signaturePolicyId);

        //signer.signDetached(digest, pks, chain, crlList, ocspClient, tsaClient, estimatedSize, subfilter);
        signer.signDetached(new BouncyCastleDigest(), pks, chain, crlList, ocspClient, tsaClient, 0, PdfSigner.CryptoStandard.CADES, sigPolicyIdentifier);
    }
}
