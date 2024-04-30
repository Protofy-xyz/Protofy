class R503 {
  type;
  name;
  platform;
  uartBusId;
  mqttTopicPrefix;

  constructor(name, platform, uartBusId) {
    this.type = 'sensor'
    this.name = name
    this.platform = platform
    this.uartBusId = uartBusId
    this.mqttTopicPrefix = ''
  }
  extractNestedComponents(element, deviceComponents) {
    const keysToExtract = [
      { key: 'mqtt', nestedKey: 'on_json_message' },
    ];
  
    keysToExtract.forEach(({ key, nestedKey }) => {
      if (element.config[nestedKey]) {
        if(!deviceComponents[key]) deviceComponents[key] = {}
        if(!deviceComponents[key][nestedKey]) deviceComponents[key][nestedKey] = []

        if(Array.isArray(deviceComponents[key][nestedKey])){
          deviceComponents[key][nestedKey].push(...element.config[nestedKey])
        } else {
          deviceComponents[key][nestedKey] = {
            ...deviceComponents[key][nestedKey],
            ...element.config[nestedKey]
          }
        }
      }
    });
  }
  extractComponent(element, deviceComponents) {
    if (['mqtt'].includes(element.name)) {
      this.extractNestedComponents(element, deviceComponents)
    } else {
      if (!deviceComponents[element.name]) {
        deviceComponents[element.name] = element.config
      } else {
        if (!Array.isArray(deviceComponents[element.name])) {
          deviceComponents[element.name] = [deviceComponents[element.name]]
        }
        deviceComponents[element.name].push(element.config)
      }
    }
  }

  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: this.platform,
        config: {
          uart_id: this.uartBusId,
          id: this.name,
          sensing_pin:{
            number: pin,
            allow_other_uses: true
          },      
          on_finger_scan_start: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "ALWAYS_ON",
                color: "GREEN",
                speed: 0,
                count: 0
              }
            }
          ],
          on_finger_scan_matched: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "FLASHING",
                speed: 200,
                color: "BLUE",
                count: 1
              }
            },
            {
              "text_sensor.template.publish": {
                id: `${this.name}_fingerprint_state`,
                state: '@!lambda return "Authorized finger " + to_string(finger_id) + ", confidence " + to_string(confidence);@'
              }
            }
          ],
          on_finger_scan_unmatched: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "FLASHING",
                speed: 25,
                color: "RED",
                count: 2
              }
            },
            {
              "text_sensor.template.publish": {
                id: `${this.name}_fingerprint_state`,
                state: "Unmatched finger"
              }
            }
          ],
          on_finger_scan_misplaced: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "FLASHING",
                speed: 25,
                color: "PURPLE",
                count: 2
              }
            },
            {
              "text_sensor.template.publish": {
                id: `${this.name}_fingerprint_state`,
                state: "Finger misplaced"
              }
            }
          ],
          on_enrollment_scan: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "FLASHING",
                speed: 25,
                color: "BLUE",
                count: 2
              }
            },
            {
              "fingerprint_grow.aura_led_control": {
                state: "ALWAYS_ON",
                speed: 0,
                color: "PURPLE",
                count: 0
              }
            }
          ],
          on_enrollment_done: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "BREATHING",
                speed: 100,
                color: "BLUE",
                count: 2
              }
            }
          ],
          on_enrollment_failed: [
            {
              "fingerprint_grow.aura_led_control": {
                state: "FLASHING",
                speed: 25,
                color: "RED",
                count: 4
              }
            }
          ]
        },
        subsystem: this.getSubsystem()
      },
      {
        name: 'binary_sensor',
        config: {
          platform: 'gpio',
          pin: {
            number: pin,
            allow_other_uses: true,
            inverted: true
          },
          name: `${this.name}-finger-present`,
        }
      },
      {
        name: 'sensor',
        config: {
          platform: 'fingerprint_grow',
          fingerprint_count: {
            name: `${this.name}-fingerprint-count`,
          },
          last_finger_id: {
            name: `${this.name}-last-finger-id`,
          },
          last_confidence: {
            name: `${this.name}-last-confidence`,
          },
          status: {
            name: `${this.name}-status`,
          },
          capacity: {
            name: `${this.name}-capacity`,
          },
          security_level: {
            name: `${this.name}-security-level`,
          }
        }
      },
      {
        name: 'mqtt',
        config: {
          on_json_message: [
            {
              topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/command`,
              then: {
                lambda:
`if (x.containsKey("action")) {
  if (x["action"] == "enroll") {
    id(${this.name}).enroll_fingerprint((int)x["finger_id"], (int)x["num_buffers"]);
  }
  if (x["action"] == "finish_enroll") {
    id(${this.name}).finish_enrollment(OK);
  }
  if (x["action"] == "delete_fingerprint") {
    id(${this.name}).delete_fingerprint((int)x["finger_id"]);
  }
  if (x["action"] == "delete_all_fingerprints") {
    id(${this.name}).delete_all_fingerprints();
  }
}`
              }
            }
          ]
        }
      },
      {
        name: 'text_sensor',
        config: {
          platform: 'template',
          name: `${this.name}-fingerprint-state`,
          id: `${this.name}_fingerprint_state`,
        }

      }
    ]

    componentObjects.forEach((element, j) => {
      this.extractComponent(element, deviceComponents)
    })
    return deviceComponents
  }
  getSubsystem() {
    return {
      name: this.name,
      type: this.type,
      monitors: [
        {
          name: 'fingerprint-state',
          description: 'Get fingerprint state',
          endpoint: "/"+this.type+"/"+this.name+"-fingerprint-state/state",
          connectionType: 'mqtt',
        },
        {
          name: 'fingerprint-count',
          description: 'Get fingerprint count',
          endpoint: "/"+this.type+"/"+this.name+"-fingerprint-count/state",
          connectionType: 'mqtt',
        },
        {
          name: 'last-finger-id',
          description: 'Get last finger id',
          endpoint: "/"+this.type+"/"+this.name+"-last-finger-id/state",
          connectionType: 'mqtt',
        },
        {
          name: 'last-confidence',
          description: 'Get last confidence',
          endpoint: "/"+this.type+"/"+this.name+"-last-confidence/state",
          connectionType: 'mqtt',
        },
        {
          name: 'status',
          description: 'Get status',
          endpoint: "/"+this.type+"/"+this.name+"-status/state",
          connectionType: 'mqtt',
        },
        {
          name: 'capacity',
          description: 'Get capacity',
          endpoint: "/"+this.type+"/"+this.name+"-capacity/state",
          connectionType: 'mqtt',
        },
        {
          name: 'security-level',
          description: 'Get security level',
          endpoint: "/"+this.type+"/"+this.name+"-security-level/state",
          connectionType: 'mqtt',
        },
        {
          name: 'finger-present',
          description: 'Detects if finger present',
          endpoint: "/binary_sensor/"+this.name+"-finger-present/state",
          connectionType: 'mqtt',
        },
      ],
      actions: [
        {
          name: 'enroll_0',
          label: 'Enroll id 0',
          description: 'Enroll a fingerprint in id 0',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'json',
            value: {
              action: 'enroll',
              finger_id: 0,
              num_buffers: 2
            },
          },
        },
        {
          name: 'finish_enroll',
          label: 'Finish enroll',
          description: 'Finish enrollment',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'json',
            value: {
              action: 'finish_enroll',
            },
          },
        },
        {
          name: 'delete_fingerprint-0',
          label: 'Delete fingerprint in id 0',
          description: 'Delete a fingerprint',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'json',
            value: {
              action: 'delete_fingerprint',
              finger_id: 0
            },
          },
        },
        {
          name: 'delete_all_fingerprints',
          label: 'Delete all fingerprints',
          description: 'Delete all fingerprints',
          endpoint: "/"+this.type+"/"+this.name+"/command",
          connectionType: 'mqtt',
          payload: {
            type: 'json',
            value: {
              action: 'delete_all_fingerprints',
            },
          },
        },
      ]
    }
  }
}

export function r503(name, uartBusName) { 
    return new R503(name, "fingerprint_grow", uartBusName);
}