/*

mcp23008:
  - id: 'mcp23008_hub'
    address: 0x20

switch:
  - platform: gpio
    name: "MCP23008 Pin #0"
    pin:
      mcp23xxx: mcp23008_hub
      # Use pin number 0
      number: 0
      mode:
        output: true
      inverted: false

binary_sensor:
  - platform: gpio
    name: "MCP23008 Pin #1"
    pin:
      mcp23xxx: mcp23008_hub
      # Use pin number 1
      number: 1
      # One of INPUT or INPUT_PULLUP
      mode:
        input: true
      inverted: false

*/

class I2c_MCP23008 {
    type;
    name;
    address;
    i2cBusId;
    IOconfig;

    constructor(name, address, i2cBusId, IOconfig) {
        this.type = "mcp23008"
        this.name = name
        this.address = address
        this.i2cBusId = i2cBusId
        this.IOconfig = IOconfig
    }
    getInputComponents() {
        let outputComponents = []
        this.IOconfig.map((ioMode, i) => {
            const mode = {}
            if(ioMode == "input") {
                mode["input"] = true
            }else{
                mode["output"] = true
            }
            const component = {
                name: ioMode == "input" ? "binary_sensor" : "switch",
                config: {
                    platform: "gpio",
                    name: this.name + '_channel_' + i,
                    pin: {
                        mcp23xxx: this.name,
                        number: i,
                        mode: mode
                    }
                }
            }
            outputComponents.push(component)
        })
        return outputComponents
    }
    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: this.type,
                config: {
                    address: this.address,
                    i2c_id: this.i2cBusId,
                    id: this.name
                },
                subsystem: this.getSubsystem()
            },
        ]
        const inputComponents = this.getInputComponents()
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
        let actions = []
        this.IOconfig.map((ioMode, i) => {
            if (ioMode == "input") {
                const monitor = {
                    label: 'channel ' + i,
                    name: this.name + '_channel_' + i,
                    description: `Get the ${i} binary sensor status pin`,
                    endpoint: "/binary_sensor/" + this.name + '_channel_' + i + "/state",
                    connectionType: "mqtt",
                }
                monitors.push(monitor)
            } else {
                const action = [
                    {
                        name: 'on',
                        label: 'Turn on pin '+i,
                        description: 'turns on the pin '+i,
                        props: {
                            theme: "green",
                            color: "$green10"
                        },
                        endpoint: "/switch/" + this.name +"_channel_" + i+ "/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'ON',
                        },
                    },
                    {
                        name: 'off',
                        label: 'Turn off pin '+i,
                        description: 'turns off the pin '+i,
                        props: {
                            theme: "red",
                            color: "$red10"
                        },
                        endpoint: "/switch/" + this.name +"_channel_" + i+ "/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'OFF',
                        },
                    },
                    {
                        name: 'toggle',
                        label: 'Toggle pin '+i,
                        description: 'Toggles the pin '+i,
                        props: {
                            theme: "purple",
                            color: "$purple10"
                        },
                        endpoint: "/switch/" + this.name +"_channel_" + i+ "/command",
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                            value: 'TOGGLE',
                        },
                    },
                    {
                        name: 'pulsed_on',
                        label: 'Pulsed ON ms on pin '+i,
                        description: 'Emmits a ON pulse with programable ms of duration pin '+i,
                        endpoint: "/switch/" + this.name +"_channel_" + i+ "/command",  
                        connectionType: 'mqtt',
                        payload: {
                            type: 'str',
                        },
                    },
                ]
                actions = actions.concat(action)
            }
        })
        return {
            name: this.name,
            type: "mcp23008",
            monitors: monitors,
            actions: actions
        }
    }
}

export function i2c_MCP23008(...params) {
    const IOconfig = params.slice(3)
    return new I2c_MCP23008(params[0], params[1], params[2], IOconfig);
}