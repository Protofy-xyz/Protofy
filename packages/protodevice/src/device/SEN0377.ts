class SEN0377 {
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
      nitrogen_dioxide:
        name: ${this.name}-nitrogen-dioxide
      carbon_monoxide:
        name: ${this.name}-carbon-monoxide
      hydrogen:
        name: ${this.name}-hydrogen
      ethanol:
        name: ${this.name}-ethanol
      methane:
        name: ${this.name}-methane
      ammonia:
        name: ${this.name}-ammonia
`
            }
        ];
    }
}


export default function sen0377(name, sclPin, address, updateInterval) {
    return new SEN0377(name, 'mics_4514', address, updateInterval, "bus_a", sclPin)
}