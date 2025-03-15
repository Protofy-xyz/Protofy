class BMP280 {
    type;
    name;
    address;
    i2cBusId;
    updateInterval
    oversampling

    constructor(name, address, i2cBusId, updateInterval, oversampling) {
        this.type = "bmp280_i2c"
        this.name = name
        this.address = address
        this.i2cBusId = i2cBusId
        this.updateInterval = updateInterval
        this.oversampling = oversampling
    }

    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    address: this.address,
                    i2c_id: this.i2cBusId,
                    update_interval: this.updateInterval,
                    temperature: {
                        oversampling: this.oversampling,
                        name: this.name + "_temperature"
                    },
                    pressure: {
                        oversampling: this.oversampling,
                        name: this.name + "_pressure"
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
            label: `Pressure`,
            name: `pressure`,
            description: `Get pressure`,
            endpoint: "/sensor/" +this.name + "_pressure"+ "/state",
            connectionType: "mqtt",
        }]
        
        return {
            name: this.name,
            type: "sensor",
            monitors: monitors
        }
    }
}

export function bmp280(name, address, i2cBusId, updateInterval, oversampling) {
    return new BMP280(name, address, i2cBusId, updateInterval, oversampling)
}