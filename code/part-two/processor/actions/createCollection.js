const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { encode } = require('../services/encoding');
const { getCollectionAddress } = require('../services/addressing');

let createCollection = (res, rej, txn, context) => {
  let signer = getCollectionAddress(txn.header.signerPublicKey);
  context.getState([signer]).then(allAddrs => {
    if (allAddrs[signer].length > 0) {
      rej(new InvalidTransaction('Signer already has collection!'));
    } else {
      let updates = {};
      let mojiArr = [
        txn.signature.substring(0, 70),
        txn.signature.substring(0, 70),
        txn.signature.substring(0, 70)
      ];
      updates[signer] = encode({
        key: txn.header.signerPublicKey,
        moji: mojiArr
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

module.exports = {
  createCollection
};
