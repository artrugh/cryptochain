const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;
const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "----",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};

const CREDENTIALS = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY,
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: "*authorized-reward*" };
const MININIG_REWARD = 50;

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  CREDENTIALS,
  CHANNELS,
  STARTING_BALANCE,
  REWARD_INPUT,
  MININIG_REWARD,
};
