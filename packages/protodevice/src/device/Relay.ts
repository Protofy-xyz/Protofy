

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

export function getSubsystem() {
    return {
      actions: [
        {
          name: 'Turn on',
          description: 'turns on the gpio',
          endpoint: '/command',
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'ON',
          },
        },
        {
          name: 'Turn off',
          description: 'turns off the gpio',
          endpoint: '/command',
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'OFF',
          },
        },
        {
          name: 'Toggle',
          description: 'Toggles the gpio',
          endpoint: '/command',
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
          endpoint: '/state',
          connectionType: 'mqtt',
        },
      ],
    }
  }

class Relay {
  name
  platform
  restoreMode
  constructor(name, platform, restoreMode) {
    this.name = name
    this.platform = platform
    this.restoreMode = restoreMode
  }


  attach(pin) {
    return [
      {
        name: 'switch',
        config: {
          //aqui estan todos los elementos del yaml anidado
          platform: this.platform,
          pin: pin,
          id: this.name,
          restore_mode: this.restoreMode,
        },
        subsystem: getSubsystem(),
      },
    ]
  }
}

export default function relay(name, restoreMode) {
  return new Relay(name, 'gpio', restoreMode)
}
