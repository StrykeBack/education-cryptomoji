const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { encode } = require('../services/encoding');
const {
  getCollectionAddress,
  getMojiAddress
} = require('../services/addressing');
const getPrng = require('../services/prng');

const createCollection = (res, rej, txn, context) => {
  let signer = getCollectionAddress(txn.header.signerPublicKey);
  context.getState([signer]).then(allAddrs => {
    if (allAddrs[signer].length > 0) {
      rej(new InvalidTransaction('Signer already has collection!'));
    } else {
      let updates = {};
      let mojiArr = [
        {
          addr: getMojiAddress(
            txn.header.signerPublicKey,
            createDna('zero', txn.signature)
          ),
          dna: createDna('zero', txn.signature)
        },
        {
          addr: getMojiAddress(
            txn.header.signerPublicKey,
            createDna('one', txn.signature)
          ),
          dna: createDna('one', txn.signature)
        },
        {
          addr: getMojiAddress(
            txn.header.signerPublicKey,
            createDna('two', txn.signature)
          ),
          dna: createDna('two', txn.signature)
        }
      ];
      for (let i = 0; i < mojiArr.length; i++) {
        updates[mojiArr[i].addr] = encode({
          dna: mojiArr[i].dna,
          owner: txn.header.signerPublicKey,
          breeder: '',
          sire: '',
          bred: [],
          sired: []
        });
      }
      updates[signer] = encode({
        key: txn.header.signerPublicKey,
        moji: mojiArr.map(moji => moji.addr)
      });
      context
        .setState(updates)
        .then(modified => {
          res(modified);
        })
        .catch(e => {
          rej(e);
        });
    }
  });
};

const createDna = (randStr, signature) => {
  let dnaStr = '';
  let randomNum =
    getPrng(randStr.toString(16))(9999999) + getPrng(signature)(9999999);
  while (dnaStr.length < 36) {
    dnaStr += randomNum.toString(16);
  }
  return dnaStr.substring(0, 36);
};

module.exports = {
  createCollection
};
