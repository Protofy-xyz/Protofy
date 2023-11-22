class NeopixelsBus {
    name;
    platform;
    rgb_order;
    chipset;
    numLeds;
    restoreMode;
    defaultTransitionLength;
    channel;
    effects= [];
    mqttMsgs;
    constructor(name, platform, numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, channel, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11) {
        this.name = name
        this.platform = platform
        this.rgb_order = rgb_order
        this.chipset= chipset
        this.numLeds = numLeds
        this.restoreMode = restoreMode
        this.defaultTransitionLength = defaultTransitionLength
        this.channel = channel
        this.effects = [effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, , effect10, effect11]
        this.mqttMsgs = {
            state: "ON",
            color: {
                r: 255,
                g: 0,
                b: 0
            },
            effect: "My Slow Random Effect",
            brightness: 255
        }
    }

    attach(pin) {
        let jsonValue = {
            componentName: 'light',
            payload:
                `  - platform: ${this.platform}
    variant: ${this.chipset}
    id: ${this.name}
    pin: ${pin}
    num_leds: ${this.numLeds}
    type: ${this.rgb_order}
    name: ${this.name}
    method:
      type: esp32_rmt
      channel: ${this.channel}

    restore_mode: ${this.restoreMode}
    default_transition_length: ${this.defaultTransitionLength}
`
        }
        var hasEffects = false
        this.effects.forEach(element => {
          if(element === true) hasEffects = true;
        });
        if (!hasEffects) return jsonValue
        else{
            jsonValue.payload = jsonValue.payload + `
    effects:
`
        if (this.effects[0]) {
            jsonValue.payload = jsonValue.payload + 
`      - pulse:
      - pulse:
          name: "Fast Pulse"
          transition_length: 0.5s
          update_interval: 0.5s
      - pulse:
          name: "Slow Pulse"
          update_interval: 2s
`
        } if (this.effects[1]) {
            jsonValue.payload = jsonValue.payload + 
`      - random:
      - random:
          name: "My Slow Random Effect"
          transition_length: 30s
          update_interval: 30s
      - random:
          name: "My Fast Random Effect"
          transition_length: 4s
          update_interval: 5s
`
        } if (this.effects[2]) {
            jsonValue.payload = jsonValue.payload + 
`      - strobe:
      - strobe:
          name: Strobe Effect With Custom Values
          colors:
          - state: true
            brightness: 100%
            red: 100%
            green: 90%
            blue: 0%
            duration: 500ms
          - state: false
            duration: 250ms
          - state: true
            brightness: 100%
            red: 0%
            green: 100%
            blue: 0%
            duration: 500ms
`
        }if (this.effects[3]) {
            jsonValue.payload = jsonValue.payload + 
`      - flicker:
      - flicker:
          name: Flicker Effect With Custom Values
          alpha: 95%
          intensity: 1.5%
`
        }if (this.effects[4]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_rainbow:
      - addressable_rainbow:
          name: Rainbow Effect With Custom Values
          speed: 10
          width: 50
`
        }if (this.effects[5]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_color_wipe:
      - addressable_color_wipe:
          name: Color Wipe Effect With Custom Values
          colors:
            - red: 100%
              green: 100%
              blue: 100%
              num_leds: 1
            - red: 0%
              green: 0%
              blue: 0%
              num_leds: 1
          add_led_interval: 100ms
          reverse: false
`
        }if (this.effects[6]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_scan:
      - addressable_scan:
          name: Scan Effect With Custom Values
          move_interval: 100ms
          scan_width: 1
`
        }if (this.effects[7]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_twinkle:
      - addressable_twinkle:
          name: Twinkle Effect With Custom Values
          twinkle_probability: 5%
          progress_interval: 4ms
`
        }if (this.effects[8]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_random_twinkle:
      - addressable_random_twinkle:
          name: Random Twinkle Effect With Custom Values
          twinkle_probability: 5%
          progress_interval: 32ms
`
        }if (this.effects[9]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_fireworks:
      - addressable_fireworks:
          name: Fireworks Effect With Custom Values
          update_interval: 32ms
          spark_probability: 10%
          use_random_color: false
          fade_out_rate: 120
`
        }if (this.effects[10]) {
            jsonValue.payload = jsonValue.payload + 
`      - addressable_flicker:
      - addressable_flicker:
          name: Flicker Effect With Custom Values
          update_interval: 16ms
          intensity: 5%
`
        }
        return jsonValue
        }

    }
}

export default function neopixelsBus(name, numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11) {
    return new NeopixelsBus(name, 'neopixelbus', numLeds, rgb_order, chipset, restoreMode, defaultTransitionLength, effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10, effect11)
}