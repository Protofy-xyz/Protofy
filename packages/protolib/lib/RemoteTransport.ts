const { Writable } = require('stream');
const mqtt = require("mqtt");

class RemoteTransport extends Writable {
  constructor(opts) {
    super(opts);
    const isProduction = process.env.NODE_ENV === 'production';
    this.client = mqtt.connect(process.env.MQTT_URL ?? ('mqtt://localhost:'+(isProduction?'8883':'1883')), {
      username: opts.username,
      password: opts.password,
      clientId: opts.username + '_' + Math.random().toString(16).substr(2, 8)
    });
  }

  _write(chunk, encoding, callback) {
    let log;
    try {
      log = JSON.parse(chunk.toString());
    } catch (e) {
      callback(e);
      return;
    }

    this.client.publish("logs/"+log.name+"/"+log.level, JSON.stringify(log));
    // process.stdout.write(JSON.stringify(log) + '\n');
    callback();
  }
}

module.exports = (options) => new RemoteTransport(options);