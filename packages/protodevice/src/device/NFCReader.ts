class NFCReader {
    name;
    type;
    platform;
    address;
    updateInterval;
    i2cBusId;
    mqttMsgs;
    constructor(name, platform, i2cBusId, updateInterval) {
        this.type = 'pn532_i2c'
        this.name = name
        this.platform = platform
        this.address
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
        this.mqttMsgs = ''
    }

    // attach(pin, deviceComponents) {
    //     const componentObjects = [
    //         {
    //             name: this.type,
    //             config: {
    //                 platform: this.platform,
    //                 id: this.name,
    //                 address: this.address,
    //                 update_interval: this.updateInterval,
    //                 Read: {name: `${this.name}`},
    //             },
    //             subsystem: this.getSubsystem()
    //         },
    //     ]
        
    //     componentObjects.forEach((element, j) => {
    //         if (!deviceComponents[element.name]) {
    //             deviceComponents[element.name] = element.config
    //         } else {
    //             if (!Array.isArray(deviceComponents[element.name])) {
    //                 deviceComponents[element.name] = [deviceComponents[element.name]]
    //             }
    //             deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
    //         }
    //     })
    //     return deviceComponents
    //     }

        attach(pin, deviceComponents) {
            const componentObjects = [
                {
                    name: this.type,
                    config: {
                        id: this.name,
                        i2c_id: this.i2cBusId,
                        update_interval: this.updateInterval,
                        on_tag: {
                            then: [
                                {'mqtt.publish': {
                                topic: `devices/${deviceComponents.esphome.name}/sensor/${this.name}/state`,
                                payload: '@!lambda return x;@',
                                },
                            },
                        ]
                        },
                          on_tag_removed: {
                            then: [
                                {'mqtt.publish': {
                                topic: `devices/${deviceComponents.esphome.name}/sensor/${this.name}/state`,
                                payload: '@!lambda return "none";@',
                                },
                            },
                        ]
                        },             
                  },
                subsystem: this.getSubsystem()
                },

                // (
                //     name: 'binary_sensor'


                // )
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
                        name: 'nfcreader',
                        labels: 'Read tag',
                        description: 'Get tag read status',
                        endpoint:  `/sensor/${this.name}/state`,
                        connectionType: 'mqtt',
                    },
                ]
            } 
        }
    }


    export function nfcreader(name, i2cBusId, updateInterval) { 
        return new NFCReader(name, 'pn532', i2cBusId, updateInterval)
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


