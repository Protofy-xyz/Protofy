class SCD4X {
    name;
    type;
    platform;
    address;
    updateInterval;
    i2cBusId;
    mqttMsgs;
    constructor(name, platform, i2cBusId, updateInterval) {
        this.type = 'sensor'
        this.name = name
        this.platform = platform
        this.address
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
        this.mqttMsgs = ''
    }

        attach(pin, deviceComponents) {
            const componentObjects = [
                {
                    name: this.type,
                    config: {
                        id: this.name,
                        i2c_id: this.i2cBusId,
                        co2:{
                            name: this.name+"-co2"
                        },
                        temperature:{
                            name: this.name+"-temperature"
                        },
                        humidity:{
                            name: this.name+"-humidity"
                        }
                  },
                subsystem: this.getSubsystem()
                }
                ]

            componentObjects.forEach((element, j) => {
                if (!deviceComponents[element.name]) {
                    deviceComponents[element.name] = element.config
                } else {
                    if (!Array.isArray(deviceComponents[element.name])) {
                        deviceComponents[element.name] = [deviceComponents[element.name]]
                    }
                    deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
                }
            })
            return deviceComponents
            }
        

        getSubsystem(){
            return{
                name: this.name,
                type: this.type,
                monitors: [
                    {
                        name: 'co2',
                        labels: 'Co2',
                        description: 'Get co2 value in ppm',
                        endpoint:  `/sensor/${this.name}/state`,
                        connectionType: 'mqtt',
                    },
                    {
                        name: 'temperature',
                        labels: 'Read tag',
                        description: 'Get temperature in ºC',
                        endpoint:  `/sensor/${this.name}/state`,
                        connectionType: 'mqtt',
                    },
                    {
                        name: 'humidity',
                        labels: 'Read tag',
                        description: 'Get humidity in %',
                        endpoint:  `/sensor/${this.name}/state`,
                        connectionType: 'mqtt',
                    },
                ]
            } 
        }
    }


    export function scd4x(name, i2cBusId, updateInterval) { 
        return new SCD4X(name, 'scd4x', i2cBusId, updateInterval)
    }







    
    // getPlatform(){
    //     return this.platform;
    // }

    // setMqttTopicPrefix(setMqttTopicPrefix){
    //     this.mqttTopicPrefix= setMqttTopicPrefix;
    // }

//     attach(pin){
//         return [
// //             {componentName: "binary_sensor", payload:
// // `    - platform: ${this.platform}
// //       name: ${this.name}
// //       uid: 74-10-37-94
// // `
// //         },
//         {componentName: `${this.platform}_i2c`, payload:
// `    update_interval: 1s
//     id: noconflict_${this.name}
//     i2c_id: ${this.i2cBusId}
//     on_tag:
//         then:
//             - mqtt.publish:
//                 topic: ${this.mqttTopicPrefix}/${this.platform}_i2c/${this.name}/state
//                 payload: !lambda 'return x;'
//     on_tag_removed:
//         then:
//             - mqtt.publish:
//                 topic: ${this.mqttTopicPrefix}/${this.platform}_i2c/${this.name}/state
//                 payload: !lambda 'return "not:"+x;'
// `
// // /*
    
// // */

// //     },
// //         {componentName: "i2c", payload:
// // `    sda: ${pin}
//     scl: ${this.sclPin}
//     #scan: true
//     id: ${this.i2cBusId}
// `
//     }
//         ]
//     }
// }


