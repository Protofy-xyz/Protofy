import OutputPin from "../nodes/OutputPin";

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
            const component = {
                name: "output",
                config: {
                    platform: "pca9685",
                    pca9685_id: this.name,
                    channel: i,
                    id: this.name+'_channel_'+i
                },
                subsystem: {}
            }
            outputComponents.push(component)
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
        return {}
    }
}

export function pca9685(name, frequency, external_clock_input, address, i2cBusId) { 
    return new PCA9685(name, frequency, external_clock_input, address, i2cBusId)
}