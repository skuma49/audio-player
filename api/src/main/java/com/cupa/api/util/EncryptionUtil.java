package com.cupa.api.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class EncryptionUtil {

    @Value("${encryption.secretKey}")
    private String secretKey;

    @Value("${encryption.salt}")
    private String salt;



    private String generateHexSalt() {
        SecureRandom random = new SecureRandom();
        byte[] saltBytes = new byte[16]; // 16 bytes = 128 bits
        random.nextBytes(saltBytes);
        return bytesToHex(saltBytes);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    public String encrypt(String plainText) {
        TextEncryptor encryptor = Encryptors.text(secretKey, salt);
        return encryptor.encrypt(plainText);
    }

    public String decrypt(String encryptedText) {
        TextEncryptor encryptor = Encryptors.text(secretKey, salt);
        return encryptor.decrypt(encryptedText);
    }

    public String getSalt() {
        return this.salt;
    }
}