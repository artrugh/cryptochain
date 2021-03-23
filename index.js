require("dotenv").config();

const express = require("express");
const request = require("request");

const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const ROOT_NODE_ADDRESS = `http://localhost:${process.env.DEFAULT_PORT}`;

app.use(express.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, res, body) => {
    if (!error && res.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log("replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = process.env.DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || process.env.DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
  if (PORT !== process.env.DEFAULT_PORT) {
    syncChains();
  }
});
