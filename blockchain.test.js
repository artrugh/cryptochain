const Block = require("./block");
const Blockchain = require("./blockchain");

describe("Blockchain", () => {
  const Blockchain = new Blockchain();
  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toEquals(true);
  });
  it("starts with the genesis block", () => {
    expect(blockchain.chain[0].toEquals(Block.genesis()));
  });

  it("add a new blockchain to the block", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.lenght - 1].data).toEqual(newData);
  });
});
