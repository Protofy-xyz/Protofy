class AHT10 {
    type;
    name;
    address;
    i2cBusId;
    updateInterval
    variant

    constructor(name, address, i2cBusId, updateInterval, variant) {
        this.type = "aht10"
        this.name = name
        this.address = address
        this.i2cBusId = i2cBusId
        this.updateInterval = updateInterval
        this.variant = variant
    }

    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    variant: this.variant,
                    address: this.address,
                    i2c_id: this.i2cBusId,
                    update_interval: this.updateInterval,
                    temperature: {
                        name: this.name + "_temperature"
                    },
                    humidity: {
                        name: this.name + "_humidity"
                    }

                },
                subsystem: this.getSubsystem()
            },
        ]
        // const inputComponents =  this.getInputComponents()
        //componentObjects = componentObjects.concat(inputComponents)
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
        let monitors = [{
            label: `Temperature`,
            name: `temperature`,
            description: `Get temperature`,
            endpoint: "/sensor/" +this.name + "_temperature"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Humidity`,
            name: `humidity`,
            description: `Get humidity`,
            endpoint: "/sensor/" +this.name + "_humidity"+ "/state",
            connectionType: "mqtt",
        }]
        
        return {
            name: this.name,
            type: "sensor",
            monitors: monitors
        }
    }
}

export function aht10(name, address, i2cBusId, updateInterval, variant) {
    return new AHT10(name, address, i2cBusId, updateInterval, variant)
}