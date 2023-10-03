class BH1750 {
    name;
    platform;
    address;
    updateInterval;
    i2cBusId;
    sclPin;
    mqttTopicPrefix;
    constructor(name, platform, address, updateInterval, i2cBusId, sclPin) {
        this.name = name
        this.platform = platform
        this.address = address
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
        this.sclPin = sclPin
        this.mqttTopicPrefix = ''
    }

    getPlatform() {
        return this.platform;
    }

    setMqttTopicPrefix(setMqttTopicPrefix) {
        this.mqttTopicPrefix = setMqttTopicPrefix;
    }

    attach(pin) {
        return [
            {
                componentName: "i2c",
                payload: `    sda: ${pin}
    scl: ${this.sclPin}
    #scan: true
    id: ${this.i2cBusId}
`
            },
            {
                componentName: `sensor`,
                payload: 
`    - platform: ${this.platform} 
      id: ${this.name}
      name: ${this.name}
      address: ${this.address}
      update_interval: ${this.updateInterval}
`
            }
        ];
    }
}


export default function bh1750(name, sclPin, address, updateInterval) {
    return new BH1750(name, 'bh1750', address, updateInterval, "bus_a", sclPin)
}