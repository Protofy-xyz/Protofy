class NeopixelsBus {
    name;
    platform;
    rgb_order;
    chipset;
    numLeds;
    restoreMode;
    defaultTransitionLength;
    channel;
    effects = [];
    mqttMsgs;
    type;
    constructor(name, platform, numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, channel, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11) {
        this.name = name
        this.type = 'light'
        this.platform = platform
        this.rgb_order = rgb_order
        this.chipset = chipset
        this.numLeds = numLeds
        this.restoreMode = restoreMode
        this.defaultTransitionLength = defaultTransitionLength
        this.channel = channel
        this.effects = [effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, , effect10, effect11]
        this.mqttMsgs = {
            state: "ON",
            color: {
                r: 255,
                g: 0,
                b: 0
            },
            effect: "My Slow Random Effect",
            brightness: 255
        }
    }

    attach(pin, deviceComponents) {
        var hasEffects = false
        this.effects.forEach(element => {
            if (element === true) hasEffects = true;
        });
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    pin: pin,
                    name: this.name,
                    id: this.name,
                    variant: this.chipset,
                    num_leds: this.numLeds,
                    type: this.rgb_order,
                    method: {
                        type: "esp32_rmt",
                        channel: this.channel
                    },
                    restore_mode: this.restoreMode,
                    default_transition_length: this.defaultTransitionLength
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
        if (!hasEffects) {
            return deviceComponents;
        } else {
            let effects = []
            if (this.effects[0]) {
                effects = effects.concat([
                    { pulse: null },
                    {
                        pulse:
                        {
                            name: "Fast Pulse",
                            transition_length: "0.5s",
                            update_interval: "0.5s"
                        }
                    },
                    {
                        pulse:
                        {
                            name: "Slow Pulse",
                            update_interval: "2s"
                        }
                    }
                ])
            }
            if (this.effects[1]) {
                effects = effects.concat([
                    { random: null },
                    {
                        random:
                        {
                            name: "My Slow Random Effect",
                            transition_length: "30s",
                            update_interval: "30s"
                        }
                    },
                    {
                        random:
                        {
                            name: "My Fast Random Effect",
                            transition_length: "4s",
                            update_interval: "5s"
                        }
                    }
                ])

            }
            if (this.effects[2]) {
                effects = effects.concat([
                    { strobe: null },
                    {
                        strobe:
                        {
                            name: "Strobe Effect With Custom Values",
                            colors: [{
                                state: true,
                                brightness: "100%",
                                red: "100%",
                                green: "0%",
                                blue: "0%",
                                duration: "500ms"
                            },
                            { state: false, duration: "250ms" },
                            {
                                state: true,
                                brightness: "100%",
                                red: "0%",
                                green: "100%",
                                blue: "0%",
                                duration: "500ms"
                            }
                            ]
                        }
                    }
                ])
            }
            if (this.effects[3]) {
                effects = effects.concat([
                    { flicker: null },
                    {
                        flicker:
                        {
                            name: "Flicker Effect With Custom Values",
                            alpha: "95%",
                            intensity: "1.5%"
                        }
                    }
                ])
            }
            if (this.effects[4]) {
                effects = effects.concat([
                    { addressable_rainbow: null },
                    {
                        addressable_rainbow:
                        {
                            name: "Rainbow Effect With Custom Values",
                            speed: 10,
                            width: 50
                        }
                    }
                ])
            }
            if (this.effects[5]) {
                effects = effects.concat([
                    { addressable_color_wipe: null },
                    {
                        addressable_color_wipe:
                        {
                            name: "Color Wipe Effect With Custom Values",
                            add_led_interval: "100ms",
                            reverse: false,
                            colors: [
                                { red: "100%", green: "100%", blue: "100%", num_leds: 1 },
                                { red: "0%", green: "0%", blue: "0%", num_leds: 1 },
                            ]
                        }
                    }
                ])
            }
            if (this.effects[6]) {
                effects = effects.concat([
                    { addressable_scan: null },
                    {
                        addressable_scan:
                        {
                            name: "Scan Effect With Custom Values",
                            move_interval: "100ms",
                            scan_width: 1
                        }
                    }
                ])
            }
            if (this.effects[7]) {
                effects = effects.concat([
                    { addressable_twinkle: null },
                    {
                        addressable_twinkle:
                        {
                            name: "Twinkle Effect With Custom Values",
                            twinkle_probability: "5%",
                            progress_interval: "4ms"
                        }
                    }
                ])
            }
            if (this.effects[8]) {
                effects = effects.concat([
                    { addressable_random_twinkle: null },
                    {
                        addressable_random_twinkle:
                        {
                            name: "Random Twinkle Effect With Custom Values",
                            twinkle_probability: "5%",
                            progress_interval: "32ms"
                        }
                    }
                ])
            }
            if (this.effects[9]) {
                effects = effects.concat([
                    { addressable_fireworks: null },
                    {
                        addressable_fireworks:
                        {
                            name: "Fireworks Effect With Custom Values",
                            update_interval: "32ms",
                            spark_probability: "10%",
                            use_random_color: false,
                            fade_out_rate: 120
                        }
                    }
                ])
            }

            if (this.effects[10]) {
                effects = effects.concat([
                    { addressable_flicker: null },
                    {
                        addressable_flicker:
                        {
                            name: "Adressable flicker Effect With Custom Values",
                            update_interval: "16ms",
                            intensity: "5%"
                        }
                    }
                ])
            }
            componentObjects[0].config["effects"] = effects
            return deviceComponents;
        }
    }
    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            actions: [
                {
                    name: 'Turn on',
                    description: 'Turns on the neopixels',
                    endpoint: "/" + this.type + "/" + this.name + "/command",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json',
                        value: {
                            state: "ON",
                            color: {
                                r: 255,
                                g: 0,
                                b: 0
                            },
                            effect: "none",
                            brightness: 255
                        },
                    },
                },
                {
                    name: 'Turn off',
                    description: 'Turns off the neopixels',
                    endpoint: "/" + this.type + "/" + this.name + "/command",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json',
                        value: {
                            state: "OFF",
                            color: {
                                r: 0,
                                g: 0,
                                b: 0
                            },
                            effect: "none",
                            brightness: 255
                        },
                    },
                },
                {
                    name: 'Toggle',
                    description: 'Turn on an effect on the gpio',
                    endpoint: "/" + this.type + "/" + this.name + "/command",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json',
                        value: {
                            state: "ON",
                            color: {
                                r: 255,
                                g: 255,
                                b: 255
                            },
                            effect: "pulse",
                            brightness: 255
                        },
                    },
                },
            ]
        }
    }
}

export default function neopixelsBus(name, numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11) {
    return new NeopixelsBus(name, 'neopixelbus', numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11)
}