const Block = require("./block");
const { cryptoHash } = require("../util");

class Blockchain {
  constructor() {
    // set the first block oof the chain using the static method
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    // push the new mined Block to the schain
    this.chain.push(newBlock);
  }

  // check if the whole chain is valid
  static isValidChain(chain) {
    // if the first block of the schain is not tthe genesis
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      // get the lastHash and difficulty
      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      // if the current last hash is not equal to the lastHash
      if (currentLastHash !== lastHash) return false;
      // encrypt the properties
      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      // if the validated hash is not equal to the hash
      if (hash !== validatedHash) return false;
      // if the difficulty was decreased more than 1
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain, onSuccess) {
    // check if the passed chain is longer than the real chain
    if (chain.length <= this.chain.length) {
      // console.error("The incoming chain must be longer");
      return;
    }
    // check validation after replacement
    if (!Blockchain.isValidChain(chain)) {
      // console.error("The incoming chain must be valid");
      return;
    }
    if (onSuccess) onSuccess();
    // console.log("replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
