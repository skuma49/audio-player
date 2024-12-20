import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = 'cupa'; // Ensure this matches the secret key used in the backend

const PresignedUrlFetcher = () => {
  const [fileId, setFileId] = useState('');
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const [salt, setSalt] = useState('');
  const [decryptedUrl, setDecryptedUrl] = useState('');

  const fetchPresignedUrl = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/audio/presigned-url', {
        params: { fileId }
      });
      setEncryptedUrl(response.data.encryptedUrl);
      setSalt(response.data.salt);
      decryptUrl(response.data.encryptedUrl, response.data.salt);
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
    }
  };

  const decryptUrl = (encryptedUrl, salt) => {
    const key = CryptoJS.PBKDF2(secretKey, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000
    });
    const decrypted = CryptoJS.AES.decrypt(encryptedUrl, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    setDecryptedUrl(CryptoJS.enc.Utf8.stringify(decrypted));
  };

  return (
    <div>
      <h1>Fetch Encrypted Pre-signed URL</h1>
      <input
        type="text"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        placeholder="Enter File ID"
      />
      <button onClick={fetchPresignedUrl}>Fetch URL</button>
      {encryptedUrl && (
        <div>
          <p><strong>Encrypted URL:</strong> {encryptedUrl}</p>
          <p><strong>Salt:</strong> {salt}</p>
          <p><strong>Decrypted URL:</strong> {decryptedUrl}</p>
        </div>
      )}
    </div>
  );
};

export default PresignedUrlFetcher;