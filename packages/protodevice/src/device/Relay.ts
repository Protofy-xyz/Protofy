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
  constructor(name, platform, restoreMode) {
    this.name = name
    this.platform = platform
    this.restoreMode = restoreMode
  }

  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: 'switch',
        config: {
          //aqui estan todos los elementos del yaml anidado
          platform: this.platform,
          pin: pin,
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
      config:{
        restoreMode: "ON"
      },
      actions: [
        {
          name: 'Turn on',
          description: 'turns on the gpio',
          endpoint: '/switch/command',
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'ON',
          },
        },
        {
          name: 'Turn off',
          description: 'turns off the gpio',
          endpoint: '/switch/command',
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'OFF',
          },
        },
        {
          name: 'Toggle',
          description: 'Toggles the gpio',
          endpoint: '/switch/command',
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'TOGGLE',
          },
        },
      ],
      monitors: [
        {
          name: 'Relay status',
          description: 'Gets the status of the relay',
          endpoint: '/switch/state',
          connectionType: 'mqtt',
        },
      ],
    }
  }
}

export default function relay(name, restoreMode) {
  return new Relay(name, 'gpio', restoreMode)
}
