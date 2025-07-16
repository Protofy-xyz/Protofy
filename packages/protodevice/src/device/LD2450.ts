class LD2450 {
    type;
    name;
    rxPin;
    updateInterval

    constructor(name, rxPin, updateInterval) {
        this.type = "ld2450"
        this.name = name
        this.rxPin = rxPin
        this.updateInterval = updateInterval
    }
    getComponentObjects(pin) {
                let componentObjects = [
            {
                name: "uart",
                config: {
                    id: this.name+ "_uart",
                    tx_pin: pin,
                    rx_pin: this.rxPin,
                    baud_rate: 256000,
                    parity: "NONE",
                    stop_bits: 1,

                },
            },
            {
                name: this.type,
                config: {
                    id: this.name,
                    uart_id: this.name + "_uart",
                    throttle: this.updateInterval,
                },
            },
            {
                name: "binary_sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    has_target: {
                        name: this.name + "_has_target",
                    },
                    has_moving_target: {
                        name: this.name + "_has_moving_target",
                    },
                    has_still_target: {
                        name: this.name + "_has_still_target",
                    }

                },
            },
            {
                name: "number",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    presence_timeout: {
                        name: this.name + "_presence_timeout",
                    },
                    zone_1: {
                        x1: {
                            name: this.name + "_zone_1_x1",
                            unit_of_measurement: "mm",
                        },
                        y1: {
                            name: this.name + "_zone_1_y1",
                            unit_of_measurement: "mm",
                        },
                        x2: {
                            name: this.name + "_zone_1_x2",
                            unit_of_measurement: "mm",
                        },
                        y2: {
                            name: this.name + "_zone_1_y2",
                            unit_of_measurement: "mm",
                        },
                    },
                    zone_2: {
                        x1: {
                            name: this.name + "_zone_2_x1",
                            unit_of_measurement: "mm",
                        },
                        y1: {
                            name: this.name + "_zone_2_y1",
                            unit_of_measurement: "mm",
                        },
                        x2: {
                            name: this.name + "_zone_2_x2",
                            unit_of_measurement: "mm",
                        },
                        y2: {
                            name: this.name + "_zone_2_y2",
                            unit_of_measurement: "mm",
                        },
                    },
                    zone_3: {
                        x1: {
                            name: this.name + "_zone_3_x1",
                            unit_of_measurement: "mm",
                        },
                        y1: {
                            name: this.name + "_zone_3_y1",
                            unit_of_measurement: "mm",
                        },
                        x2: {
                            name: this.name + "_zone_3_x2",
                            unit_of_measurement: "mm",
                        },
                        y2: {
                            name: this.name + "_zone_3_y2",
                            unit_of_measurement: "mm",
                        },
                    },


                },
            },
            {
                name: "switch",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    bluetooth: {
                        name: this.name + "_bluetooth",
                    },
                    multi_target: {
                        name: this.name + "_multi_target",
                    }
                }
            },
            {
                name: "select",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    baud_rate: {
                        name: this.name + "_baud_rate",
                        // options: ["9600", "19200", "38400", "57600", "115200", "230400", "256000", "460800"]

                    },
                    zone_type: {
                        name: this.name + "_zone_type",
                        // options: ["Disabled", "Detection", "Filter"]
                    }
                }
            },
            {
                name: "button",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    factory_reset: {
                        name: this.name + "_factory_reset",
                    },
                    restart: {
                        name: this.name + "_restart",
                    }
                }
            },
            {
                name: "text_sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    version: {
                        name: this.name + "_version",
                    },
                    mac_address: {
                        name: this.name + "_mac_address",
                    },
                    target_1: {
                        direction: {
                            name: this.name + "_target_1_direction",
                        }
                    },
                    target_2: {
                        direction: {
                            name: this.name + "_target_2_direction",
                        }
                    },
                    target_3: {
                        direction: {
                            name: this.name + "_target_3_direction",
                        }
                    }
                }
            },
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    target_count: {
                        name: this.name + "_target_count",
                    }
                }
            },
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    still_target_count: {
                        name: this.name + "_still_target_count",
                    }
                }
            },
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    moving_target_count: {
                        name: this.name + "_moving_target_count",
                    }
                }
            },
            {
                name: "sensor",
                config: {
                    platform: this.type,
                    ld2450_id: this.name,
                    target_1: {
                        x: {
                            name: this.name + "_target_1_x",
                            unit_of_measurement: "mm",
                        },
                        y: {
                            name: this.name + "_target_1_y",
                            unit_of_measurement: "mm",
                        },
                        speed: {
                            name: this.name + "_target_1_speed",
                            unit_of_measurement: "mm/s",
                        },
                        angle: {
                            name: this.name + "_target_1_angle",
                            unit_of_measurement: "°",
                        },
                        distance: {
                            name: this.name + "_target_1_distance",
                            unit_of_measurement: "mm",
                        },
                        resolution: {
                            name: this.name + "_target_1_resolution",
                            unit_of_measurement: "mm"
                        }
                    },
                    target_2: {
                        x: {
                            name: this.name + "_target_2_x",
                            unit_of_measurement: "mm",
                        },
                        y: {
                            name: this.name + "_target_2_y",
                            unit_of_measurement: "mm",
                        },
                        speed: {
                            name: this.name + "_target_2_speed",
                            unit_of_measurement: "mm/s",
                        },
                        angle: {
                            name: this.name + "_target_2_angle",
                            unit_of_measurement: "°",
                        },
                        distance: {
                            name: this.name + "_target_2_distance",
                            unit_of_measurement: "mm",
                        },
                        resolution: {
                            name: this.name + "_target_2_resolution",
                            unit_of_measurement: "mm"
                        }
                    },
                    target_3: {
                        x: {
                            name: this.name + "_target_3_x",
                            unit_of_measurement: "mm",
                        },
                        y: {
                            name: this.name + "_target_3_y",
                            unit_of_measurement: "mm",
                        },
                        speed: {
                            name: this.name + "_target_3_speed",
                            unit_of_measurement: "mm/s",
                        },
                        angle: {
                            name: this.name + "_target_3_angle",
                            unit_of_measurement: "°",
                        },
                        distance: {
                            name: this.name + "_target_3_distance",
                            unit_of_measurement: "mm",
                        },
                        resolution: {
                            name: this.name + "_target_3_resolution",
                            unit_of_measurement: "mm"
                        }
                    },
                    zone_1: {
                        target_count: {
                            name: this.name + "_zone_1_target_count",
                        },
                        still_target_count: {
                            name: this.name + "_zone_1_still_target_count",
                        },
                        moving_target_count: {
                            name: this.name + "_zone_1_moving_target_count",
                        }
                    },
                    zone_2: {
                        target_count: {
                            name: this.name + "_zone_2_target_count",
                        },
                        still_target_count: {
                            name: this.name + "_zone_2_still_target_count",
                        },
                        moving_target_count: {
                            name: this.name + "_zone_2_moving_target_count",
                        }
                    },
                    zone_3: {
                        target_count: {
                            name: this.name + "_zone_3_target_count",
                        },
                        still_target_count: {
                            name: this.name + "_zone_3_still_target_count",
                        },
                        moving_target_count: {
                            name: this.name + "_zone_3_moving_target_count",
                        }
                    }
                }
            }
        ]
        return componentObjects
    }
    attach(pin, deviceComponents) {
        let componentObjects = this.getComponentObjects(pin)
        // const inputComponents =  this.   getInputComponents()
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
        let componentObjects = this.getComponentObjects("dummy_pin");
        const componentTypesWithMonitors = ["sensor", "binary_sensor", "number", "select", "switch", "text_sensor"];
        const monitors = [];
        componentObjects.forEach(component => {
            if (!componentTypesWithMonitors.includes(component.name)) return;

            let type = component.name;
            const config = component.config;

            if (type === "text_sensor") type = "sensor";


            for (const key in config) {
                if (["platform", "ld2450_id", "uart_id"].includes(key)) continue;

                const entry = config[key];

                // If the config entry is an object and has a `name`, treat it as a monitor
                if (entry && typeof entry === "object" && entry.name) {
                    monitors.push({
                        label: this._humanize(key),
                        name: key,
                        description: `${this._humanize(key)} of ${this.name}`,
                        endpoint: `/${type}/${entry.name}/state`,
                        connectionType: "mqtt",
                        ...(entry.unit_of_measurement && { units: entry.unit_of_measurement })
                    });
                }

                // Handle nested objects (e.g. target_1.direction or zone_1.x1)
                else if (entry && typeof entry === "object") {
                    for (const subKey in entry) {
                        const subEntry = entry[subKey];
                        if (subEntry && typeof subEntry === "object" && subEntry.name) {
                            const fullKey = `${key}_${subKey}`;
                            monitors.push({
                                label: this._humanize(fullKey),
                                name: fullKey,
                                description: `${this._humanize(fullKey)} of ${this.name}`,
                                endpoint: `/${type}/${subEntry.name}/state`,
                                connectionType: "mqtt",
                                ...(subEntry.unit_of_measurement && { units: subEntry.unit_of_measurement })
                            });
                        }
                    }
                }
            }
        });

        var actions = [
            {
                name: 'bluetooth_on',
                label: 'Turn on Bluetooth',
                description: 'turns on the bluetooth',
                props: {
                    theme: "green",
                    color: "$green10"
                },
                endpoint: "/switch/"+this.name+"_bluetooth/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'ON',
                },
            },
            {
                name: 'bluetooth_off',
                label: 'Turn off Bluetooth',
                description: 'turns off the bluetooth',
                props: {
                    theme: "red",
                    color: "$red10"
                },
                endpoint: "/switch/"+this.name+"_bluetooth/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'OFF',
                },
            },
            {
                name: 'multi_target_on',
                label: 'Enable Multi Target Mode',
                description: 'Enables multi target mode',
                props: {
                    theme: "green",
                    color: "$green10"
                },
                endpoint: "/switch/"+this.name+"_multi_target/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'ON',
                },
            },
            {
                name: 'multi_target_off',
                label: 'Disable Multi Target Mode',
                description: 'Disables multi target mode',
                props: {
                    theme: "red",
                    color: "$red10"
                },
                endpoint: "/switch/"+this.name+"_multi_target/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'OFF',
                },
            },
            {
                name: 'factory_reset',
                label: 'Factory Reset',
                description: 'Resets the device to factory settings',
                props: {
                    theme: "red",
                    color: "$red10"
                },
                endpoint: "/button/"+this.name+"_factory_reset/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'PRESS',
                },
            },
            {
                name: 'restart',
                label: 'Restart Device',
                description: 'Restarts the device',
                props: {
                    theme: "blue",
                    color: "$blue10"
                },
                endpoint: "/button/"+this.name+"_restart/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'str',
                    value: 'PRESS',
                },
            },
            {
                name: 'baudrate_select',
                label: 'Select Baud Rate',
                description: 'Selects the baud rate for the device',
                props: {
                    theme: "blue",
                    color: "$blue10"
                },
                endpoint: "/select/"+this.name+"_baud_rate/command",
                connectionType: 'mqtt',
                payload: [
                    { label: '9600', value: 9600 },
                    { label: '19200', value: 19200 },
                    { label: '38400', value: 38400 },
                    { label: '57600', value: 57600 },
                    { label: '115200', value: 115200 },
                    { label: '230400', value: 230400 },
                    { label: '256000', value: 256000 },
                    { label: '460800', value: 460800 }
                ]
            },
            {
                name: 'zone_type_select',
                label: 'Select Zone Type',
                description: 'Selects the zone type for the device',
                props: {
                    theme: "blue",
                    color: "$blue10"
                },
                endpoint: "/select/"+this.name+"_zone_type/command",
                connectionType: 'mqtt',
                payload: [
                    { label: 'Disabled', value: "Disabled" },
                    { label: 'Detection', value: "Detection" },
                    { label: 'Filter', value: "Filter" }
                ]
            },
            {
                name: 'set_presence_timeout',
                label: 'Set Presence Timeout',
                description: 'Sets the presence timeout for the device',
                endpoint: "/number/"+this.name+"_presence_timeout/command",
                connectionType: 'mqtt',
                payload: {
                    type: 'slider',
                    min_value: 0,
                    max_value: 60,
                    step: 1,
                    initial_value: 10
                },
            },
        ];
        const coordinateActions = [];
        const coords = ['x1', 'y1', 'x2', 'y2'];
        for (let zone = 1; zone <= 3; zone++) {
            coords.forEach(coord => {
                const min_value = coord.startsWith('y') ? 0 : -4860;
                const max_value = coord.startsWith('y') ? 7560 : 4860;
                coordinateActions.push({
                    name: `set_zone_${zone}_${coord}`,
                    label: `Zone ${zone} ${coord.toUpperCase()}`,
                    description: `Sets the ${coord.toUpperCase()} coordinate of Zone ${zone}`,
                    endpoint: `/number/${this.name}_zone_${zone}_${coord}/command`,
                    connectionType: 'mqtt',
                    payload: {
                        type: 'slider',
                        min_value,
                        max_value,
                        step: 10,
                        initial_value: 0
                    },
                });
            });
        }
        actions.push(...coordinateActions);
        return {
            name: this.name,
            type: "sensor",
            monitors,
            actions
        };
    }

    // Utility to format keys into readable labels
    _humanize(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

export function ld2450(name, rxPin, updateInterval) {
    return new LD2450(name, rxPin, updateInterval)
}