class SEN0377 {
    name;
    address;
    i2cBusId;
    updateInterval;
    platform;

    constructor(name, address, i2cBusId, updateInterval) {
        this.name = name
        this.platform = "mics_4514"
        this.address = address
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
    }
    
    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: "sensor",
                config: {
                    platform: this.platform,
                    address: this.address,
                    i2c_id: this.i2cBusId,
                    update_interval: this.updateInterval,
                    nitrogen_dioxide: {
                        name: this.name + "_nitrogen_dioxide"
                    },
                    carbon_monoxide: {
                        name: this.name + "_carbon_monoxide"
                    },
                    hydrogen: {
                        name: this.name + "_hydrogen"
                    },
                    ethanol: {
                        name: this.name + "_ethanol"
                    },
                    methane: {
                        name: this.name + "_methane"
                    },
                    ammonia: {
                        name: this.name + "_ammonia"
                    }

                },
                subsystem: this.getSubsystem()
            },
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

    getSubsystem() {
        let monitors = [{
            label: `Nitrogen Dioxide`,
            name: `nitrogen_dioxide`,
            description: `Get nitrogen dioxide level`,
            endpoint: "/sensor/" +this.name + "_nitrogen_dioxide"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Carbon Monoxide`,
            name: `carbon_monoxide`,
            description: `Get carbon monoxide level`,
            endpoint: "/sensor/" +this.name + "_carbon_monoxide"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Hydrogen`,
            name: `hydrogen`,
            description: `Get hydrogen level`,
            endpoint: "/sensor/" +this.name + "_hydrogen"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Ethanol`,
            name: `ethanol`,
            description: `Get ethanol level`,
            endpoint: "/sensor/" +this.name + "_ethanol"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Methane`,
            name: `methane`,
            description: `Get methane level`,
            endpoint: "/sensor/" +this.name + "_methane"+ "/state",
            connectionType: "mqtt",
        },
        {
            label: `Ammonia`,
            name: `ammonia`,
            description: `Get ammonia level`,
            endpoint: "/sensor/" +this.name + "_ammonia"+ "/state",
            connectionType: "mqtt",
        }]
        
        return {
            name: this.name,
            type: "sensor",
            monitors: monitors
        }
    }
}


export function sen0377(name, address, i2cBusId, updateInterval) {
    return new SEN0377(name, address, i2cBusId, updateInterval)
}