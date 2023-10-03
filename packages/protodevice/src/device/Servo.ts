class Servo {
    name;
    platform;
    mqttTopicPrefix;
    constructor(name, platform) {
        this.name = name
        this.platform = platform
        this.mqttTopicPrefix = ''
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }


    attach(pin) {
        return [
            {   componentName: "on_message",
                payload:
`    - topic: ${this.mqttTopicPrefix}/${this.platform}/${this.name}/command
      then:
      - lambda: |-
         float value = atoi(x.c_str());
         if(value >= 0 && value <= 180) id(${this.name}).write(value/180);
         if(value > 180) id(${this.name}).write(180);
         if(value < 0) id(${this.name}).write(0);
`
          
},
            {componentName: 'output', payload:
`  - platform: ledc
    pin: ${pin}
    id: ${this.name}ledcOutput
    frequency: 50 Hz
`},
        {componentName: 'servo', payload:
`  - id: ${this.name}
    output: ${this.name}ledcOutput
    auto_detach_time: 0s
    transition_length: 0s
`},
]
    }
}

export default function servo(name) { 
    return new Servo(name, 'servo')
}