import OutputPin from "../nodes/OutputPin";
import { output } from "./Output";

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
    getOutputComponents() {
        let outputComponents = []
        for(var i = 0; i < 16; i++){
            const outputComponent = {
                name: "output",
                config: {
                    platform: "pca9685",
                    pca9685_id: this.name,
                    channel: i,
                    id: this.name+'_channel_'+i+'_output',
                },
                subsystem: {}
            }
            outputComponents.push(outputComponent)
            const switchComponent = {
                name: "switch",
                config: {
                    platform: "output",
                    name: this.name+'_channel_'+i,
                    id: this.name+'_channel_'+i,
                    output: this.name+'_channel_'+i+'_output',
                    restore_mode: "ALWAYS_OFF"
                },
                subsystem: {
                    name: this.name+'_channel_'+i,
                    type: this.type,
                    config:{
                        restoreMode: "ON"
                    },
                    actions: [
                        {
                        name: 'on',
                        label: 'Turn on',
                        description: 'turns on the gpio',
                        props: {
                            theme: "green",
                            color: "$green10"
                        },
                        endpoint: "/switch/"+this.name+'_channel_'+i+"/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'ON',
                        },
                        },
                        {
                        name: 'off',
                        label: 'Turn off',
                        description: 'turns off the gpio',
                        props: {
                            theme: "red",
                            color: "$red10"
                        },
                        endpoint: "/switch/"+this.name+'_channel_'+i+"/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'OFF',
                        },
                        },
                        {
                        name: 'toggle',
                        label: 'Toggle',
                        description: 'Toggles the gpio',
                        props: {
                            theme: "purple",
                            color: "$purple10"
                        },
                        endpoint: "/switch/"+this.name+'_channel_'+i+"/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'TOGGLE',
                        },
                        }
                    ]
                }
            }
            outputComponents.push(switchComponent)
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
        const outputComponents = this.getOutputComponents()
        componentObjects = componentObjects.concat(outputComponents)
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

    getSubsystem() {
        //put all the subsystems from indvividual switch components here
        const outputComponents = this.getOutputComponents()
        let subsystems = []
        outputComponents.forEach((element, j) => {
            subsystems.push(element.subsystem)
        })
        return subsystems
    }
}

export function pca9685(name, frequency, external_clock_input, address, i2cBusId) { 
    return new PCA9685(name, frequency, external_clock_input, address, i2cBusId)
}