const redis = require("redis");
const Blockchain = require("../blockschain");
const PubSub = require("./pubsub");
const { CHANNELS } = require("../config");

describe("Pubsub", () => {
  const blockchain = new Blockchain();
  const pubsub = new PubSub({ blockchain });
  //   const readisCreateCkient = redis.createClient();

  it("has blockchain, publisher, pubsub, subscribeToChannels()", () => {
    expect(pubsub.blockchain).toEqual(blockchain);

    // expect(pubsub.publisher).toEqual(readisCreateCkient);

    // expect(pubsub.subscriber).toEqual(redis.createClient());

    expect(pubsub.subscribeToChannels()).toEqual(undefined);
    // expect(pubsub.subscriber.on("message")).toEqual(Function);
  });

  describe("subscribeToChannels()", () => {
    Object.values(CHANNELS).forEach((channel) => {
      it("subscribes subscriber", () => {
        expect(pubsub.subscriber.subscribe(channel)).toEqual(false);
      });
    });
  });

  //   describe("handleMessage()", () => {

  //   });
});
