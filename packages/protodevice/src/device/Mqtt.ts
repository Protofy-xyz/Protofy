class Mqtt {
    broker
    topic_prefix
    constructor(broker, topic_prefix) {
      this.broker = broker
      this.topic_prefix = topic_prefix
    }
  
  
    attach(pin) {
      return [
        {
          name: 'mqtt',
          config: {
            broker: this.broker,
            topic_prefix: this.topic_prefix,
          }
        }
      ]
    }
  }
  
  export default function mqtt(broker, topic_prefix) {
    return new Mqtt(broker, topic_prefix)
  }
  