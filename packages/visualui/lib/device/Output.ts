class Output {
    name;
    platform
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

    attach(pin) {
        return {componentName: 'output', payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
`}
    }
}

export default function output(name) { 
    return new Output(name, 'gpio')
}