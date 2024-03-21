class MicrofirePhEcTemp {
    name;
    platform;
    scl;
    updateInterval;
    type;
    constructor(name, updateInterval, scl) {
        this.name = name
        this.platform = 'mod_ntc'
        this.scl = scl
        this.type = "sensor"
        this.updateInterval = updateInterval

    }


    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: 'external_components',
                config: [{
                    source: {
                        type: 'git',
                        url: 'https://github.com/u-fire/ESPHomeComponents/'
                    },
                }]
            },
            {
                name: 'i2c',
                config: {
                    sda: pin,
                    scl: this.scl,
                    // scan: true,
                    // id: 'bus_a'
                },
                subsystem: this.getSubsystem()
            },
            {
                name: this.type,
                config: {
                    platform: 'mod_ntc',
                    id: "water_temp",
                    name: "water-temp",
                    on_value: {
                        then: [
                            { "component.update": "ec" },
                            { "component.update": "ph" },
                        ]
                    }
                },
                subsystem: this.getSubsystem()
            },
            {
                name: this.type,
                config: {
                    platform: "mod_ec",
                    id: "ec",
                    update_interval: this.updateInterval,
                    name: 'EC',
                    temperature_sensor: "water_temp"
                },
                subsystem: this.getSubsystem()
            },
            {
                name: this.type,
                config: {
                    platform: "mod_ph",
                    id: "ph",
                    update_interval: this.updateInterval,
                    name: "pH",
                    temperature_sensor: "water_temp"
                },
                subsystem: this.getSubsystem()
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ec_calibrate_low",
                    name: "EC Calibrate Low 0.5",
                    on_press: {
                        lambda: "return id(ec).calibrateLow(0.5);"
                    }
                }
            },
            // {
            //     name: 'button',
            //     config: {
            //         platform: 'template',
            //         id: "ec_calibrate_mid",
            //         name: "EC Calibrate Mid 1.0",
            //         on_press: {
            //             lambda: "return id(ec).calibrateMid(1.0);"
            //         }
            //     }
            // },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ec_calibrate_high",
                    name: "EC Calibrate High 5.0",
                    on_press: {
                        lambda: "return id(ec).calibrateHigh(5.0);"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ec_calibrate_reset",
                    name: "EC Calibrate Reset",
                    on_press: {
                        lambda: "return id(ec).calibrateReset();"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ph_calibrate_low",
                    name: "pH Calibrate Low 4.0",
                    on_press: {
                        lambda: "return id(ph).calibrateLow(4.0);"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ph_calibrate_mid",
                    name: "pH Calibrate Mid 7.0",
                    on_press: {
                        lambda: "return id(ph).calibrateMid(7.0);"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ph_calibrate_high",
                    name: "pH Calibrate High 10.0",
                    on_press: {
                        lambda: "return id(ph).calibrateHigh(10.0);"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'template',
                    id: "ph_calibrate_reset",
                    name: "pH Calibrate Reset",
                    on_press: {
                        lambda: "return id(ph).calibrateReset();"
                    }
                }
            },
            {
                name: 'button',
                config: {
                    platform: 'factory_reset',
                    name: "Restart with Factory Default Settings"
                }
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

    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            monitors: [
                {
                    name: "Ph",
                    label: "ph",
                    description: "Get sensor status",
                    endpoint: "/" + this.type + "/" + 'ph' + "/state",
                    connectionType: "mqtt",
                },
                {
                    name: "Water Temperature",
                    label: "water-temp",
                    description: "Get sensor status",
                    endpoint: "/" + this.type + "/" + 'water-temp' + "/state",
                    connectionType: "mqtt",
                },
                {
                    name: "EC",
                    label: "ec",
                    description: "Get sensor status",
                    endpoint: "/" + this.type + "/" + 'ec' + "/state",
                    connectionType: "mqtt",
                }
            ]

        }
    }
}


export default function microfirePhEcTemp(name, updateInterval, scl) {
    return new MicrofirePhEcTemp(name, scl, updateInterval);
}
