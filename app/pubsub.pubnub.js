const PubNub = require("pubnub");
const { CREDENTIALS } = require("./config");

const credentials = {
  publishKey: CREDENTIALS.PUBLISH_KEY,
  subscribeKey: CREDENTIALS.SUBSCRIBE_KEY,
  secretKey: CREDENTIALS.SECRET_KEY,
};

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }
  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(
          `Message received.Channel: ${channel}. Message: ${message}`
        );
      },
    };
  }
  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}

module.exports = PubSub;
