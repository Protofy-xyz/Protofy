import { extractComponent } from "./utils"

class RotaryEncoder {
    name
    platform
    restoreMode
    type
    pinB
    pinReset
    motorName
    constructor(name, platform,pinB, pinReset,motorName ) {
        this.name = name
        this.platform = platform
        this.restoreMode = "ALWAYS_ZERO"
        this.type = 'sensor'
        this.pinB = pinB
        this.pinReset = pinReset
        this.motorName= motorName?? ""
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    pin_a: pin,
                    pin_b: this.pinB,
                    name: this.name,
                    id: this.name,
                    restore_mode: this.restoreMode,
                    publish_initial_value: true
                },
                subsystem: this.getSubsystem()
            }
        ]
        if(this.pinReset != "NONE"){
            componentObjects[0]["config"]["pin_reset"]= this.pinReset
        }
        if(this.motorName != ""){
            componentObjects.push({
                name: "globals",
                config: {
                    initial_value: '0',
                    type: "int",
                    id: `target_position_${this.name}`
                }
            })
            componentObjects.push({
                name: "interval",
                config:{
                    interval: "10ms",
                    then: {
                        lambda:
`if(!id(${this.motorName}).has_reached_target()){
    return;
  }
  if((id(${this.name}).state > (id(target_position_${this.name})+2))||(id(rotencoder).state < (id(target_position_${this.name})-2))){
    if (id(${this.name}).state < id(target_position_${this.name})) {
        id(${this.motorName}).set_target(id(${this.motorName}).current_position + 9*(id(target_position_${this.name})-id(${this.name}).state));
    } else {
        id(${this.motorName}).set_target(id(${this.motorName}).current_position - 9*(id(${this.name}).state-id(target_position_${this.name})));
    }
    ESP_LOGD("Current pos","Current position: %d",  id(${this.motorName}).current_position);
    ESP_LOGD("Set target","Targeted position: %d",  id(${this.motorName}).target_position);
}`                  }
                }
            })

            componentObjects.push(
                {
                    name: 'mqtt',
                    config: {
                      on_message: [
                        {
                          topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/command`,
                          then: {
                            lambda:
`
int value = atoi(x.c_str());
id(target_position_${this.name}) = value;
ESP_LOGD("Report position", "${this.name} stepper move X steps set to: %d",  value);
`,
                          }
                        }
                      ]
                    }
                  }
            )

        }
        if(this.motorName != ""){
            componentObjects.forEach((element, j) => {
                deviceComponents = extractComponent(element, deviceComponents, [{ key: 'mqtt', nestedKey: 'on_message' }])
            })    
        }else{
            componentObjects.forEach((element, j) => {
                deviceComponents = extractComponent(element, deviceComponents)
            })
        }

        return deviceComponents
    }

    getSubsystem() {
        const outSubsystem =  {
            name: this.name,
            type: this.type,
            config: {
                restoreMode: this.restoreMode
            },
            monitors: [
                {
                    name: "status",
                    label: "Get status",
                    description: "Get rotary encoder status",
                    endpoint: "/" + this.type + "/" + this.name + "/state",
                    connectionType: "mqtt"
                }
            ]
        }
        if(this.motorName != ""){
            outSubsystem["actions"]=[{
                name: "move",
                label: "Move to pos",
                description: "Move stepper to desired encoder position",
                endpoint: "/" + this.type + "/" + this.name + "/command",
                connectionType: "mqtt",
                payload: {
                    type: 'str'
                }
            }]
        }

        return outSubsystem
    }
}

export function rotaryEncoder(name, pinB,pinReset,motorName) {
    return new RotaryEncoder(name, 'rotary_encoder',pinB,pinReset,motorName)
}