import CryptoJS from "crypto-js";

const secretKey = "cupa"; // Must match the secret key used in the backend
const predefinedSalt = "a1b2c3d4e5f6a7b8"; // Must match the predefined salt used in the backend

export const decryptUrl = (encryptedUrl) => {
  try {
    // Check if encryptedUrl is undefined
    if (!encryptedUrl) {
      console.error("Encrypted URL is undefined.");
      return null;
    }

    // Decrypt the URL using AES decryption
    const bytes = CryptoJS.AES.decrypt(encryptedUrl, secretKey, {
      mode: CryptoJS.mode.CBC, // Use CBC mode
      padding: CryptoJS.pad.Pkcs7, // Use PKCS7 padding
      iv: CryptoJS.enc.Hex.parse(predefinedSalt), // Use the predefined salt as the IV
    });

    // Convert the decrypted bytes to a UTF-8 string
    const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);

    // Check if the decrypted URL is valid
    if (!decryptedUrl) {
      console.error("Decrypted URL is empty or invalid.");
      return null;
    }

    return decryptedUrl;
  } catch (error) {
    console.error("Error decrypting URL:", error);
    return null;
  }
};