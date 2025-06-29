const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
  }

  getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== this.keyLength) {
      throw new Error(`Encryption key must be exactly ${this.keyLength} characters long`);
    }
    return Buffer.from(key, 'utf8');
  }

  encrypt(text) {
    try {
      if (!text || typeof text !== 'string') return text;
      
      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, key);
      
      cipher.setAAD(Buffer.from('journal-data', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      return text; // Return original text if encryption fails
    }
  }

  decrypt(encryptedData) {
    try {
      if (!encryptedData || typeof encryptedData === 'string') {
        return encryptedData; // Return as-is if not encrypted object
      }
      
      const { encrypted, iv, authTag } = encryptedData;
      if (!encrypted || !iv || !authTag) {
        return encrypted || encryptedData; // Return original if missing parts
      }
      
      const key = this.getEncryptionKey();
      const decipher = crypto.createDecipher(this.algorithm, key);
      
      decipher.setAAD(Buffer.from('journal-data', 'utf8'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData.encrypted || encryptedData; // Return encrypted text if decryption fails
    }
  }

  hashPassword(password) {
    return crypto.pbkdf2Sync(password, 'journal-salt', 1000, 64, 'sha512').toString('hex');
  }

  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }
}

// Simple text-based encryption for development (fallback)
class SimpleEncryption {
  encrypt(text) {
    if (!text || typeof text !== 'string') return text;
    return Buffer.from(text, 'utf8').toString('base64');
  }

  decrypt(encodedText) {
    try {
      if (!encodedText || typeof encodedText !== 'string') return encodedText;
      return Buffer.from(encodedText, 'base64').toString('utf8');
    } catch (error) {
      return encodedText; // Return original if decoding fails
    }
  }
}

// Export factory function that chooses encryption method
const createEncryptionService = () => {
  try {
    return new EncryptionService();
  } catch (error) {
    console.warn('Using simple encryption fallback:', error.message);
    return new SimpleEncryption();
  }
};

module.exports = {
  EncryptionService,
  SimpleEncryption,
  createEncryptionService
}; 