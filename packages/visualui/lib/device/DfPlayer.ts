class Dfplayer {
    name;
    platform;
    rxPin;
    busyPin;
    mqttTopicPrefix;

    constructor(name, platform, rxPin, busyPin) {
        this.name = name
        this.platform = platform
        this.rxPin = rxPin
        this.busyPin = busyPin
        this.mqttTopicPrefix = ''
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }

    attach(pin) {
        return [
        {componentName: "on_json_message",
        payload:
`   - topic: ${this.mqttTopicPrefix}/${this.platform}/${this.name}/command
     then:
        - lambda: |-
            if (x.containsKey("file2Play")){
                id(${this.platform}file) = (int) x["file2Play"];
                for(int i = 0; i<10 && !id(${this.name}busypin).state; i++){
                  id(${this.name}).play_file((int) x["file2Play"]);
                }
            }
            if(x.containsKey("volume")){
                id(${this.platform}vol) = (int) x["volume"];
                id(${this.name}).set_volume((int) x["volume"]);
            }
`    
        },
        {componentName: 'globals', payload:
`
    - id: ${this.platform}file
      type: int
      restore_value: no
      initial_value: '0'
    - id: ${this.platform}vol
      type: int
      restore_value: no
      initial_value: '30'

`
        },
//         {componentName: 'script', payload:
// `
//     - id: ${this.platform}play
//       then:
//         - lambda: |-
//             dfplayer::PlayFileAction<> *dfplayer_playfileaction;
//             dfplayer_playfileaction = new dfplayer::PlayFileAction<>();
//             dfplayer_playfileaction->set_parent(${this.name});
//             dfplayer_playfileaction->set_file((int) ${this.platform}file);
//     - id: ${this.platform}volume
//       then:
//         - lambda: |-
//             dfplayer::SetVolumeAction<> *dfplayer_setvolumeaction;
//             dfplayer_setvolumeaction = new dfplayer::SetVolumeAction<>();
//             dfplayer_setvolumeaction->set_parent(${this.name});
//             dfplayer_setvolumeaction->set_volume((int) ${this.platform}vol);
// `
//         },
        {componentName: 'uart', payload:
`   id: ${this.name}dfplayer
   tx_pin: ${pin}
   rx_pin: ${this.rxPin}
   baud_rate: 9600

` },   {componentName: this.platform, payload:
`   uart_id: ${this.name}dfplayer
   id: ${this.name}
   on_finished_playback:
       then:
           logger.log: 'Somebody press play!'

`},
      {componentName: 'binary_sensor', payload:    
`    - platform: gpio
      pin: ${this.busyPin}
      id: ${this.name}busypin
      name: ${this.name}busypin
      filters:
        - invert:
        - delayed_on: 100ms
        - delayed_off: 100ms

` },  
]
    }
}


/**
uart:
  id: dfplayerUart
  tx_pin: 16
  rx_pin: 17
  baud_rate: 9600

# Declare DFPlayer mini module
dfplayer:
  uart_id: dfplayerUart
  on_finished_playback:
    then:
      logger.log: 'Somebody press play!'    
        
 * 
 */
export default function dfplayer(name, rxPin,busyPin) { 
    return new Dfplayer(name, 'dfplayer', rxPin, busyPin);
}