import { extractComponent } from "./utils"

// msa3xx:
//   model: msa301
//   i2c_id: busName
//   range: 4G
//   resolution: 12
//   update_interval: 15s
//   calibration:
//     offset_x: -0.250
//     offset_y: -0.400
//     offset_z: -0.800

// on_tap:
// - then:
//     - logger.log: "Tapped"
//     - light.turn_on:
//         id: leds
//         brightness: 80%
//         red: 0%
//         green: 0%
//         blue: 100%
// on_double_tap:
// - then:
//     - logger.log: "Double tapped"
//     - light.turn_on:
//         id: leds
//         brightness: 80%
//         red: 0%
//         green: 100%
//         blue: 0%
// on_active:
// - then:
//     - logger.log: "Activity detected"
//     - light.turn_on:
//         id: leds
//         brightness: 80%
//         red: 0%
//         green: 100%
//         blue: 100%
// on_orientation:
// - then:
//     - logger.log: "Orientation changed"
//     - light.turn_on:
//         id: leds
//          brightness: 80%
//         red: 100%
//         green: 100%
//         blue: 0%


class Msa3xx {
    name
    id
    platform
    model
    type
    updateInterval
    i2cId
    range
    resolution
    constructor(name, platform, updateInterval, i2cBus, model,range,resolution) {
        this.name = name
        this.id = name
        this.platform = platform
        this.type = 'msa3xx'
        this.updateInterval = updateInterval
        this.i2cId = i2cBus
        this.range = range
        this.resolution = parseInt(resolution)
        this.model = model
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    // platform: this.platform,
                    model: this.model, 
                    range: this.range,
                    resolution: this.resolution,
                    id: this.name,
                    i2c_id: this.i2cId,
                    calibration: {
                        offset_x: -0.250,
                        offset_y: -0.400,
                        offset_z: -0.800
                    },
                    transform: {
                        mirror_x: false,
                        mirror_y: false,
                        mirror_z: false,
                        swap_xy: false,
                    },
                    on_tap: {
                        then: {
                            "mqtt.publish": {
                                topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/tap`,
                                payload: "Tapped"
                            }
                        }
                    },
                    on_double_tap: {
                        then: {
                            "mqtt.publish": {
                                topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/double_tap`,
                                payload: "Double Tapped"
                            }
                        }
                    },
                    on_active: {
                        then: {
                            "mqtt.publish": {
                                topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/active`,
                                payload: "Active"
                            }
                        }
                    },
                    on_orientation: {
                        then: {
                            "mqtt.publish": {
                                topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/orientation`,
                                payload: "Changed orientation"
                            }
                        }
                    }
                },
                subsystem: this.getSubsystem()
            }
        ]
        // external_components:
        //   - source: github://pr#6795
        //     refresh: 10s
        //     components: [msa3xx]
        componentObjects.push({
            name: "external_components",
            config: {
                source: "github://pr#6795",
                refresh: "10s",
                components: ["msa3xx"]
            }
        })

        componentObjects.forEach((element, j) => {
            deviceComponents = extractComponent(element, deviceComponents)
        })

        return deviceComponents
    }

    getSubsystem() {
        const outSubsystem = {
            name: this.name,
            type: this.type,
            config: {
            },
            monitors: [
                {
                    name: "status",
                    label: "Get status",
                    description: "Get msa3xx status",
                    endpoint: "/" + this.type + "/" + this.name + "/state",
                    connectionType: "mqtt"
                },
                {
                    name: "tap",
                    label: "Get tap",
                    description: "Get msa3xx tapped",
                    endpoint: "/" + this.type + "/" + this.name + "/tap",
                    connectionType: "mqtt"
                },
                {
                    name: "double_tap",
                    label: "Get double tap",
                    description: "Get msa3xx double tapped",
                    endpoint: "/" + this.type + "/" + this.name + "/double_tap",
                    connectionType: "mqtt"
                },
                {
                    name: "active",
                    label: "Get active ",
                    description: "Get msa3xx active",
                    endpoint: "/" + this.type + "/" + this.name + "/active",
                    connectionType: "mqtt"
                },
                {
                    name: "on_orientation",
                    label: "Get orientation",
                    description: "Get msa3xx orientation",
                    endpoint: "/" + this.type + "/" + this.name + "/orientation",
                    connectionType: "mqtt"
                }
            ]
        }

        return outSubsystem
    }
}

export function msa3xx(name, updateInterval,i2cBus, model, range,resolution) {
    return new Msa3xx(name, 'msa301', updateInterval,i2cBus,model, range,resolution)
}