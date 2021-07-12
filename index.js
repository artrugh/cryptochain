require("dotenv").config();

const express = require("express");
const request = require("request");

const Blockchain = require("./blockschain");
const PubSub = require("./app/pubsub");
const TransactionMiner = require("./app/transaction-miner");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet/.");

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();

const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

const ROOT_NODE_ADDRESS = `http://localhost:${process.env.DEFAULT_PORT}`;

app.use(express.json());

app.get("/api/blocks", (_, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        amount,
        recipient,
        chain: blockchain.chain,
      });
    }
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: "success", transaction });
});

app.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransaction();
  console.log(transactionMiner.mineTransaction());

  res.redirect("/api/blocks");
});

app.get("/api/transact-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, res, body) => {
    if (!error && res.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log("replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transact-pool-map` },
    (error, res, body) => {
      if (!error && res.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          "replace transaction pool map on a sync with",
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = +process.env.DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || process.env.DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
  if (PORT !== process.env.DEFAULT_PORT) {
    syncWithRootState();
  }
});
