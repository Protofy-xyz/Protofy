class ClimateIR {
    name;
    platform;
    protocol;
    horizontal_default;
    verical_default;
    max_temperature;
    min_temperature;
    mqttTopicPrefix;

    constructor(name, platform, protocol, horizontal_default, vertical_default, max_temperature, min_temperature) {
        this.name = name
        this.platform = platform
        this.protocol = protocol
        this.horizontal_default = horizontal_default
        this.verical_default = vertical_default
        this.max_temperature = max_temperature
        this.min_temperature = min_temperature
        this.mqttTopicPrefix = ''
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }

    attach(pin) {
        return [
        {componentName: "remote_transmitter",
        payload:
`   pin: ${pin}
   carrier_duty_percent: 50%

`    
        },
        {componentName: 'climate', payload:
`  - platform: ${this.platform}
    name: "${this.name}"
    id: ${this.name}
    protocol: ${this.protocol}
    horizontal_default: ${this.horizontal_default}
    vertical_default: ${this.verical_default}
    max_temperature: ${this.max_temperature}
    min_temperature: ${this.min_temperature}

`
        },
]
    }
}


export default function climateIR(name, protocol, horizontal_default, vertical_default, max_temperature, min_temperature) {
    return new ClimateIR(name, 'heatpumpir', protocol, horizontal_default, vertical_default, max_temperature, min_temperature);
}
