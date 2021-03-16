const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      if (currentLastHash !== lastHash) return false;
      const validaredHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validaredHash) return false;
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;
    if (!Blockchain.isValidChain(chain)) return;
    this.chain = chain;
  }
}

module.exports = Blockchain;
