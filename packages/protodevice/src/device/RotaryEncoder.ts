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
            componentObjects[0]["config"]["on_value"]= {
                then:{ "script.execute": `position_script_${this.name}` }
            }
            componentObjects.push({
                name: "globals",
                //@ts-ignore
                config: [
                    {        
                    initial_value: '0',
                    type: "int",
                    id: `target_position_${this.name}`
                    },
                    {        
                        initial_value: '1',
                        type: "int",
                        id: `disable_control_${this.name}`
                    },{
                        id: `step_by_encoder_ratio_${this.name}`,
                        initial_value: '1.56',
                        type: "float"
                    }
                ]
            })
            componentObjects.push({
                name: "script",
                config:{
                    id: `position_script_${this.name}`,
                    //@ts-ignore
                    then: {
                        lambda:
`if(id(disable_control_${this.name})==0){
    return;
    if(!id(${this.motorName}).has_reached_target()){
        return;
    }else{
        if((id(${this.name}).state > (id(target_position_${this.name})+1))||(id(${this.name}).state < (id(target_position_${this.name})-1))){
            if (id(${this.name}).state < id(target_position_${this.name})) {
                id(${this.motorName}).set_target(id(${this.motorName}).current_position + id(step_by_encoder_ratio_${this.name})*(id(target_position_${this.name})-id(${this.name}).state));
            } else {
                id(${this.motorName}).set_target(id(${this.motorName}).current_position - id(step_by_encoder_ratio_${this.name})*(id(${this.name}).state-id(target_position_${this.name})));
            }
            ESP_LOGD("Current pos","Current position: %d",  id(${this.motorName}).current_position);
            ESP_LOGD("Set target","Targeted position: %d",  id(${this.motorName}).target_position);
        }
    }
}`                  }
                }
            })

            componentObjects.push(
                {
                    name: 'mqtt',
                    config: {
                      //@ts-ignore
                      on_message: [
                        {
                          topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/command`,
                          then: {
                            lambda:
`
int value = atoi(x.c_str());
id(target_position_${this.name}) = value;
id(position_script_${this.name}).execute();
ESP_LOGD("Position control", "${this.name} position control stepper steps set to: %d",  value);
`,
                          }
                        },{
                            topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/disable_pos_control`,
                            then: {
                                lambda:
`
int value = atoi(x.c_str());
id(disable_control_${this.name}) = value;
ESP_LOGD("Position control", "${this.name} disable position control set to: %d",  value);
`
                            }
                        },{
                            topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/step_by_encoder_ratio`,
                            then: {
                                lambda:
`
float value = atof(x.c_str());
id(step_by_encoder_ratio_${this.name}) = value;
ESP_LOGD("Position control", "${this.name} Step by encoder ratio set to: %.2f",  value);
`
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
            },
            {
                name: "ratio",
                label: "Step by encoder ratio",
                description: "This float ratio defines the number of steps by encoder ratio",
                endpoint: "/" + this.type + "/" + this.name + "/step_by_encoder_ratio",
                connectionType: "mqtt",
                payload: {
                    type: 'float'
                }
            },
            {
                name: "enable",
                label: "Enable pos control",
                description: "Enable position control",
                endpoint: "/" + this.type + "/" + this.name + "/disable_pos_control",
                connectionType: "mqtt",
                payload: {
                    type: 'str',
                    value: "0"
                }
            },
            {
                name: "disable",
                label: "Disable pos control",
                description: "Disable position control",
                endpoint: "/" + this.type + "/" + this.name + "/disable_pos_control",
                connectionType: "mqtt",
                payload: {
                    type: 'str',
                    value: "1"
                }
            }
            ]
        }

        return outSubsystem
    }
}

export function rotaryEncoder(name, pinB,pinReset,motorName) {
    return new RotaryEncoder(name, 'rotary_encoder',pinB,pinReset,motorName)
}