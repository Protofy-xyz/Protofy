class HM3301 {
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
      address: ${this.address}
      update_interval: ${this.updateInterval}
      pm_1_0:
        name: "${this.name}-pm1-0"
      pm_2_5:
        name: "${this.name}-pm2-5"
      pm_10_0:
        name: "${this.name}-pm10-0"
      aqi:
        name: "${this.name}-aqi"
        calculation_type: "CAQI"
`
            }
        ];
    }
}


export default function hm3301(name, sclPin, address, updateInterval) {
    return new HM3301(name, 'hm3301', address, updateInterval, "bus_a", sclPin)
}