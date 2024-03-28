// class DeviceComponent {
//   name
//   config
//   subsystem

//   constructor(name, config, subsystem) {
//     this.name = name
//     this.config = config
//     this.subsystem = subsystem
//   }
// }



class Relay {
  name
  platform
  restoreMode
  type
  constructor(name, platform, restoreMode) {
    this.name = name
    this.platform = platform
    this.restoreMode = restoreMode
    this.type = 'switch'
  }

  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: this.type,
        config: {
          //aqui estan todos los elementos del yaml anidado
          platform: this.platform,
          pin: pin,
          name: this.name,
          id: this.name,
          restore_mode: this.restoreMode,
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
    return {
      name: this.name,
      type: this.type,
      config:{
        restoreMode: "ON"
      },
      actions: [
        {
          name: 'on',
          label: 'Turn on',
          description: 'turns on the gpio',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'ON',
          },
        },
        {
          name: 'off',
          label: 'Turn off',
          description: 'turns off the gpio',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'OFF',
          },
        },
        {
          name: 'toggle',
          label: 'Toggle',
          description: 'Toggles the gpio',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'TOGGLE',
          },
        },
      ]
    }
  }
}

export function relay(name, restoreMode) {
  return new Relay(name, 'gpio', restoreMode)
}

export const GPIOSwitch = relay