import * as secp256k1 from 'secp256k1';
import { randomBytes, createHash } from 'crypto';


/**
 * This module is essentially identical to part-one's signing module.
 * Feel free to copy in your solution from there.
 *
 * This function generates a random Secp256k1 private key, returning it as
 * a 64 character hex string.
 */
export const createPrivateKey = () => {
  let privKey;

  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  const buf = Buffer.from(privKey);

  return buf.toString('hex', 0, 64);
};

/**
 * Takes a hexadecimal private key and returns its public pair as a
 * 66 character hexadecimal string.
 */
export const getPublicKey = privateKey => {
  const buf = Buffer.from(privateKey, 'hex');
  const pubKey = secp256k1.publicKeyCreate(buf);
  return pubKey.toString('hex', 0, 66);
};

/**
 * This convenience function did not exist in part-one's signing module, but
 * should be simple to implement. It creates both private and public keys,
 * returning them in an object with two properties:
 *   - privateKey: the hex private key
 *   - publicKey: the matching hex public key
 *
 * Example:
 *   const keys = createKeys();
 *   console.log(keys);
 *   // {
 *   //   privateKey: 'e291df3eede7f0c520fddbe5e9e53434ff7ef3c0894ed9d9cbc...',
 *   //   publicKey: '0202694593ddc71061e622222ed400f5373cfa7ea607ce106cca...'
 *   // }
 */
export const createKeys = () => {
  let privateKey = createPrivateKey();
  return {
    privateKey,
    publicKey: getPublicKey(privateKey)
  }
};

/**
 * Takes a hex private key and a string message, returning a
 * hexadecimal signature.
 */
export const sign = (privateKey, message) => {
  let msgBuf = Buffer.from(message);
  let privKeyBuf = Buffer.from(privateKey, 'hex');
  const hashMsg = createHash('SHA256')
    .update(msgBuf)
    .digest();
  const sigObj = secp256k1.sign(hashMsg, privKeyBuf);
  return sigObj.signature.toString('hex', 0, 128);
};
