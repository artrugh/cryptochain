const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util");

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    // date when the block is built
    this.timestamp = timestamp;
    // encrypted hash from the last block of the schain which includes the whole contructor, exclunding the hash
    this.lastHash = lastHash;
    // the constructor (excluding tha hash) is encrypted
    this.hash = hash;
    this.data = data;
    // data after the difficulty
    this.nonce = nonce;
    // difficulty setted by a number
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    // get hash from the last Block
    const lastHash = lastBlock.hash;
    let hash, timestamp;
    // destructure the difficulty from the the last Block
    let { difficulty } = lastBlock;
    // set the nonce in 0
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      // adjust the difficulty depending on thee timestamp
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      // create the encrypted hash
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      // run the loop till the lenght of the difficulty match
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    // once the lenght of the difficulty match return a new Block
    return new this({
      timestamp,
      lastHash,
      difficulty,
      data,
      nonce,
      hash,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    // avoid to set the set the difficulty with negative numbers
    if (difficulty < 1) return 1;
    // if the mined proccess takes more than 10 min, decrease the difficulty by 1
    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

module.exports = Block;
