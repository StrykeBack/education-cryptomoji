'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  return (
    signing.verify(
      transaction.source,
      transaction.source + transaction.recipient + transaction.amount,
      transaction.signature
    ) && transaction.amount > 0
  );
};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  let hashStr =
    JSON.stringify(block.transactions) +
    JSON.stringify(block.previousHash) +
    block.nonce;
  let hashBuf = Buffer.from(hashStr);
  return (
    block.hash ===
    createHash('SHA512')
      .update(hashBuf)
      .digest()
      .toString('hex')
  );
};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  let valid = true;
  let genesis = blockchain.blocks[0];

  if (genesis.transactions.length > 0 || genesis.previousHash !== null) {
    valid = false;
  }

  for (let i = blockchain.blocks.length - 1; i > 0; i--) {
    let currBlock = blockchain.blocks[i];
    if (currBlock.hash === null || currBlock.previousHash === null) {
      valid = false;
    } else if (currBlock.previousHash !== blockchain.blocks[i - 1].hash) {
      valid = false;
    } else if (!isValidBlock(currBlock)) {
      valid = false;
    }
  }

  return valid;
};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  blockchain.getHeadBlock().transactions = [];
};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
