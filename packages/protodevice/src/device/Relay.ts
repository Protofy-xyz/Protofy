import { extractComponent } from "./utils"
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




class RelayComponent {
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
      },          {
        name: 'mqtt',
        config: {
          on_message: [
            {
              topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/pulsed_on`,
              then: [
                {"switch.turn_on": this.name},
                //{delay: `!lambda "return atoi(x.c_str());"`},
                {delay: '@!lambda return atoi(x.c_str());@'},
                {"switch.turn_off": this.name},
              ],
//               then: {
//                 lambda:
// `id(${this.name}).turn_on();
// int value = atoi(x.c_str());
// id(${this.name}).set_target(value);
// ESP_LOGD("PulsedOn", "${this.name} stepper target set to: %d",  value);
// `,
//               }
            }
          ]
        }
      }
    ]

    // componentObjects.forEach((element, j) => {
    //     if (!deviceComponents[element.name]) {
    //         deviceComponents[element.name] = element.config
    //     } else {
    //         if (!Array.isArray(deviceComponents[element.name])) {
    //             deviceComponents[element.name] = [deviceComponents[element.name]]
    //         }
    //         deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
    //     }
    // })

    componentObjects.forEach((element, j) => {
      deviceComponents = extractComponent(element, deviceComponents, [{ key: 'mqtt', nestedKey: 'on_message' }])
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
          props: {
            theme: "green",
            color: "$green10"
          },
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
          props: {
            theme: "red",
            color: "$red10"
          },
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
          props: {
            theme: "purple",
            color: "$purple10"
          },
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'str',
            value: 'TOGGLE',
          },
        },
        {
          name: 'pulsed_on',
          label: 'Pulsed ON ms',
          description: 'Emmits a ON pulse with programable ms of duration',
          endpoint: "/"+this.type+"/"+this.name+"/pulsed_on",
          connectionType: 'mqtt',
          payload: {
            type: 'str',
          },
        },
      ]
    }
  }
}

export function relay(name, restoreMode) {
  return new RelayComponent(name, 'gpio', restoreMode)
}