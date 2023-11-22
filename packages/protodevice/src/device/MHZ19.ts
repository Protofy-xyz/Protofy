class MHZ19 {
    name;
    platform;
    rxPin;
    updateInterval;
    mqttTopicPrefix;

    constructor(name, platform, rxPin, updateInterval) {
        this.name = name
        this.platform = platform
        this.rxPin = rxPin
        this.updateInterval = updateInterval
        this.mqttTopicPrefix = ''
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }

    attach(pin) {
        return [
        {componentName: 'uart', payload:
`  tx_pin: ${pin}
  rx_pin: ${this.rxPin}
  baud_rate: 9600
` },
{componentName: 'sensor', payload:
`    - platform: ${this.platform}
      co2:
        name: "${this.name}-co2"
      temperature:
        name: "${this.name}-temperature"
      update_interval: ${this.updateInterval}
`
} 
]
    }
}

export default function mhz19(name, rxPin, updateInterval) { 
    return new MHZ19(name, 'mhz19', rxPin, updateInterval);
}