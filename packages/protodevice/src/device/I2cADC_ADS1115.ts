class I2cADC_ADS1115 {
    type;
    name;
    address;
    i2cBusId;
    updateInterval

    constructor(name, address, i2cBusId, updateInterval) {
        this.type = "ads1115"
        this.name = name
        this.address = address
        this.i2cBusId = i2cBusId
        this.updateInterval = updateInterval
    }
    getInputComponents() {
        let outputComponents = []
        for(var i = 0; i < 4; i++){
            const component = {
                name: "sensor",
                config: {
                    platform: this.type,
                    name: this.name+'_channel_'+i,
                    id: this.name+'_channel_'+i,
                    multiplexer: `A${i}_GND`,
                    gain: 6.144,
                    update_interval: this.updateInterval,
                    accuracy_decimals: 2
                }
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
                    address: this.address,
                    i2c_id: this.i2cBusId
                },
                subsystem: this.getSubsystem()
            },
        ]
        const inputComponents =  this.getInputComponents()
        componentObjects = componentObjects.concat(inputComponents)
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
        let monitors = []
        for(var i = 0; i < 4; i++){
            const monitor = {
                label: `A${i} status`,
                name: `a${i}-status`,
                description: `Get A${i} sensor status`,
                endpoint: "/sensor/"+this.name+'_channel_'+i+"/state",
                connectionType: "mqtt",
            }
            monitors.push(monitor)
        }
        return {
            name: this.name,
            type: "sensor",
            monitors: monitors
        }
    }
}

export function i2cADC_ADS1115(name, address, i2cBusId, updateInterval) { 
    return new I2cADC_ADS1115(name, address, i2cBusId, updateInterval)
}