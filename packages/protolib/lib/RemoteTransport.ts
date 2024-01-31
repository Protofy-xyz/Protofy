const { Writable } = require('stream');
const mqtt = require("mqtt");

const isProduction = process.env.NODE_ENV === 'production';
const client = mqtt.connect(process.env.MQTT_URL ?? ('mqtt://localhost:'+(isProduction?'8883':'1883')));

const onLogCallback = (logObj) => {
  client.publish("logs/"+logObj.name+"/"+logObj.level, JSON.stringify(logObj));
};

class RemoteTransport extends Writable {
  constructor(opts) {
    super(opts);
  }

  _write(chunk, encoding, callback) {
    let log;
    try {
      log = JSON.parse(chunk.toString());
    } catch (e) {
      callback(e);
      return;
    }

    onLogCallback(log);
    // process.stdout.write(JSON.stringify(log) + '\n');
    callback();
  }
}

module.exports = (options) => new RemoteTransport(options);