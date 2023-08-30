// const pinTable = [
//     '34', '35', '32', '33', '25', '26', '27', '14', '12', '13', 'D2', 'D3',
//     '23', '22', 'TX', 'RX', '21', '19', '18', '5', '17', '16', '4', '0', '2', '15', 'D1', 'D0'
// ]

export const pinTable = [
    '34', '35', '32', '33', '25', '26', '27', '14', '12', 'GND', '13',
    'D2', 'D3', 'CMD', '5V', 'GND', '23', '22', 'TX', 'RX', '21', 'GND',
    '19', '18', '5', '17', '16', '4', '0', '2', '15', 'D1', 'D0'
]

class Device {
    name;
    type;
    components;
    ssid;
    password;
    mqtt;
    mqttPrefix;
    mqttJsonEndpoints;
    onJsonMessage;
    onMessage;
    wifiPowerMode;

    constructor(deviceInfo) {
        this.name = deviceInfo[0]
        this.type = deviceInfo[1]
        this.ssid = deviceInfo[2]
        this.password = deviceInfo[3]
        this.wifiPowerMode = deviceInfo[4]
        this.mqtt = deviceInfo[5]
        this.mqttPrefix = ""
        this.components = deviceInfo.slice(6)
        this.mqttJsonEndpoints = ''
        this.onJsonMessage = ''
        this.onMessage = ''
    }

    setMqttPrefix(mqttPrefix) {
        this.mqttPrefix = mqttPrefix
        return this
    }

    setWifiPowerMode(mode) {
        if (this.wifiPowerMode === 'none') {
            if (mode === 'light' || mode == 'high') {
                this.wifiPowerMode = mode
            }

            return
        }

        if (this.wifiPowerMode === 'light' && mode === 'high') {
            this.wifiPowerMode = mode
            return
        }

        this.wifiPowerMode === mode // for "high" mode cases on this.wifiPowerMode
    }

    getComponentsJSON() {
        var finalJSON = {}
        var prevComponentsOut = []
        console.log('components', this.components)
        this.components.forEach((component, i) => {
            if (component) {
                try {
                    component.setMqttTopicPrefix(`${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}`);
                } catch (e) {

                }

                try {
                    this.setWifiPowerMode(component.getWifiPowerMode())
                } catch (e) {

                }
                // if(component.platform == 'pn532'){
                //    component.setMqttTopicPrefix(`${this.mqttPrefix!=''?this.mqttPrefix+'/'+this.name:this.name}`);   
                // }
                // if(component.platform == 'ledc'){
                //     component.setMqttTopicPrefix(`${this.mqttPrefix!=''?this.mqttPrefix+'/'+this.name:this.name}`);    
                // }
                // if(component.platform == 'pca9685'){
                //     component.setMqttTopicPrefix(`${this.mqttPrefix!=''?this.mqttPrefix+'/'+this.name:this.name}`);    
                // }

                console.log('component', component)
                var repeated = false
                const componentsOut = component.attach(pinTable[i]);
                if (!componentsOut.length) {
                    if (finalJSON.hasOwnProperty(componentsOut.componentName)) {
                        finalJSON[componentsOut.componentName].push(componentsOut.payload);
                    } else {
                        finalJSON[componentsOut.componentName] = [componentsOut.payload];
                    }
                } else {
                    componentsOut.map((componentOut) => {
                    if (finalJSON.hasOwnProperty(componentOut.componentName)) {
                        prevComponentsOut.forEach(component => {
                            if(component.payload === componentOut.payload) repeated = true
                        })
                        if(!repeated) finalJSON[componentOut.componentName].push(componentOut.payload);
                        repeated = false
                    } else {
                        finalJSON[componentOut.componentName] = [componentOut.payload]
                    }
                    prevComponentsOut.push(componentOut)
                    })
                }
            }
        })
        console.log("Final JSON: ", finalJSON)
        return finalJSON
    }

    extractOnJSONMessage(components) {
        if (!components.on_json_message) return components;
        components.on_json_message.map(e => {
            this.onJsonMessage = this.onJsonMessage + e.replaceAll('\n', '\n    ')
        })
        delete components.on_json_message
        return components
    }

    extractOnMessage(components) {
        if (!components.on_message) return components;
        components.on_message.map(e => {
            this.onMessage = this.onMessage + e.replaceAll('\n', '\n    ')
        })
        delete components.on_message
        return components
    }

    create() {
        var components = this.getComponentsJSON()
        var outStr = ''

        components = this.extractOnJSONMessage(components)
        components = this.extractOnMessage(components)

        Object.keys(components).map((k) => {
            if (components[k].length > 1) {
                outStr = outStr + `${k}:` + '\n' + components[k].join('');
            } else {
                outStr = outStr + `${k}:` + '\n' + components[k];
            }
        })
        return this.dump() + outStr;
    }

    dump() {
        return `esphome:
    name: ${this.name}

esp32:
    board: ${this.type}
    framework:
        type: arduino

logger:

wifi:
    ssid: "${this.ssid}"
    password: "${this.password}"
    power_save_mode: ${this.wifiPowerMode} 

mqtt:
    broker: ${this.mqtt}
    topic_prefix: ${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}
    ${this.onJsonMessage == '' ? '' : "on_json_message:"}
    ${this.onJsonMessage}
    ${this.onMessage == '' ? '' : "on_message:"}
    ${this.onMessage}
`
    }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}