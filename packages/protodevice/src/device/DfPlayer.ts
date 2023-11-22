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
            {
                name: "on_json_message",
                config: {
                    topic: `${this.mqttTopicPrefix}/${this.platform}/${this.name}/command`,
                    then: {
                        lambda:
`if (x.containsKey("file2Play")){
    id(${this.platform}file) = (int) x["file2Play"];
    for(int i = 0; i<10 && !id(${this.name}busypin).state; i++){
      id(${this.name}).play_file((int) x["file2Play"]);
    }
}
if(x.containsKey("volume")){
    id(${this.platform}vol) = (int) x["volume"];
    id(${this.name}).set_volume((int) x["volume"]);
}`
                    }
                }
            },
            {
                name: "globals",
                config: {
                    id: `${this.platform}file`,
                    type: "int",
                    restore_value: "no",
                    initial_value: '0',
                }
            },
            {
                name: "globals",
                config: {
                    id: `${this.platform}vol`,
                    type: "int",
                    restore_value: "no",
                    initial_value: '30',
                }
            },
            {
                name: "uart",
                config: {
                    id: `${this.platform}dfplayer`,
                    tx_pin: pin,
                    rx_pin: this.rxPin,
                    baud_rate: 9600
                }
            },
            {
                name: this.platform,
                config: {
                    uart_id: `${this.platform}dfplayer`,
                    id: this.name,
                    on_finished_playback:{
                        then:{
                            "logger.log": 'Somebody press play!'
                        }
                    }
                },
                subsystem:{ //de aqui podemos derivar todas las posibles acciones que permite este componente
                    action:[
                        {
                            name: "Set Volume",
                            description: "Sets de mp3 volume",
                            endpoint: "/command",
                            connectionType: "mqtt",
                            payload: {
                                type: "json",
                                json:{
                                    volume: {
                                        type: "int",
                                        min: 0,
                                        max: 30
                                    }
                                }
                            }
                        },
                        {
                            name: "Play file",
                            description: "Plays the specified file",
                            endpoint: "/command",
                            connectionType: "mqtt",
                            value: {
                                type: "json",
                                json:{
                                    file2Play:{
                                        type: "int",
                                        min: 0,
                                        max: undefined
                                    }
                                }
                            }
                        }
                    ]
                }
                
            },
            {
                name: "binary_sensor",
                config: {
                    platform: "gpio",
                    pin: this.busyPin,
                    name: `${this.name}busypin`,
                    id: `${this.name}busypin`,
                    filters: [
                        { invert: null },
                        { delayed_off: "100ms" },
                        { delayed_on: "100ms" }
                    ]
                }
            }
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