class NFCReader {
    name;
    platform;
    i2cBusId;
    sclPin;
    mqttTopicPrefix;
    constructor(name, platform, i2cBusId, sclPin) {
        this.name = name
        this.platform = platform
        this.i2cBusId = i2cBusId
        this.sclPin = sclPin
        this.mqttTopicPrefix = ''
    }

    getPlatform(){
        return this.platform;
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }

    attach(pin){
        return [
//             {componentName: "binary_sensor", payload:
// `    - platform: ${this.platform}
//       name: ${this.name}
//       uid: 74-10-37-94
// `
//         },
        {componentName: `${this.platform}_i2c`, payload:
`    update_interval: 1s
    id: noconflict_${this.name}
    i2c_id: ${this.i2cBusId}
    on_tag:
        then:
            - mqtt.publish:
                topic: ${this.mqttTopicPrefix}/${this.platform}_i2c/${this.name}/state
                payload: !lambda 'return x;'
    on_tag_removed:
        then:
            - mqtt.publish:
                topic: ${this.mqttTopicPrefix}/${this.platform}_i2c/${this.name}/state
                payload: !lambda 'return "not:"+x;'
`
/*
    
*/

    },
        {componentName: "i2c", payload:
`    sda: ${pin}
    scl: ${this.sclPin}
    #scan: true
    id: ${this.i2cBusId}
`
    }
        ]
    }
}


export default function nfcReader(name, sclPin) { 
    return new NFCReader(name, 'pn532',"bus_a",sclPin)
}