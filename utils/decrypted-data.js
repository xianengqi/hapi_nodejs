// utils/decrypted-data.js

// 封装的 decryptData, 用户解码小程序的 encryptData
const crypto = require('crypto');

const decryptData = (encryptedData, iv, sessionKey, appid) => {
  // base64 decode
  const encryptedData = Buffer.from(encryptedData, 'base64');
  const sessionKeyNew = Buffer.from(sessionKey, 'base64');
  const ivNew = Buffer.from(iv, 'base64');

  
}