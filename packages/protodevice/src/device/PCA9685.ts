import {extractComponent} from './utils'

class PCA9685 {
    type;
    name;
    frequency;
    external_clock_input;
    address;
    i2cBusId;

    constructor(name, frequency, external_clock_input, address, i2cBusId) {
        this.type = "pca9685"
        this.name = name
        this.frequency = frequency
        this.external_clock_input = external_clock_input
        this.address = address
        this.i2cBusId = i2cBusId
    }
    getOutputComponents(deviceComponents={}) {
        let outputComponents = []
        for(var i = 0; i < 16; i++){
            const component = {
                name: "output",
                config: {
                    platform: "pca9685",
                    pca9685_id: this.name,
                    channel: i,
                    id: this.name+'_channel_'+i
                },
                // subsystem:{}
                subsystem: {
                    name: this.name+'_channel_'+i,
                    type: this.type,
                    config:{
                    },
                    actions: [
                      {
                        name: 'ch_'+i+'_pwm_lvl',
                        label: 'Channel '+i +' pwm level',
                        description: 'Set the pwm level in normalized range (0-1), Examples: 0.4, 0.5,...',
                        endpoint: "/"+this.type+"/"+this.name+'_channel_'+i+"/command",
                        connectionType: 'mqtt',
                        payload: {
                          type: 'str',
                        },
                      },
                    ]
                  }
            }
            outputComponents.push(component)

            if(deviceComponents.esphome){
                const mqttComponent = {
                    name: 'mqtt',
                    config: {
                    on_message: [
                        {
                        topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name+'_channel_'+i}/command`,
                        then: [
                            {
                            lambda: `float value = atof(x.c_str()); id(${this.name+'_channel_'+i}).set_level(value);ESP_LOGD("Pwm output ${this.name+'_channel_'+i}", "Received value: %f", value);`
                        },
                        ]
                        }
                    ]
                    }
                }
                outputComponents.push(mqttComponent)
            }
        }
        return outputComponents
    }
    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: this.type,
                config: {
                    id: this.name,
                    ...(this.external_clock_input ? {} : { frequency: this.frequency }),
                    external_clock_input: this.external_clock_input,
                    address: this.address,
                    i2c_id: this.i2cBusId
                },
                subsystem: this.getSubsystem()
            },
        ]
        const outputComponents = this.getOutputComponents(deviceComponents)
        componentObjects = componentObjects.concat(outputComponents)
        // componentObjects.forEach((element, j) => {
        //     if (!deviceComponents[element.name]) {
        //         deviceComponents[element.name] = element.config
        //     } else {
        //         if (!Array.isArray(deviceComponents[element.name])) {
        //             deviceComponents[element.name] = [deviceComponents[element.name]]
        //         }
        //         deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
        //     }
        // })
        componentObjects.forEach((element, j) => {
            deviceComponents = extractComponent(element, deviceComponents, [{ key: 'mqtt', nestedKey: 'on_message' }])
          })
        return deviceComponents
    }

    getSubsystem() {
        const outputComponents = this.getOutputComponents()
        const actions = []
        outputComponents.forEach((outputComponent) => {
            actions.push(outputComponent.subsystem.actions[0])
        })
        const subsystem = {
            name: this.name,
            type: this.type,
            config:{},
            actions: actions
        }
        return subsystem
    }
}

export function pca9685(name, frequency, external_clock_input, address, i2cBusId) { 
    return new PCA9685(name, frequency, external_clock_input, address, i2cBusId)
}