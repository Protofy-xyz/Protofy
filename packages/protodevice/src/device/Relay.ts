const jsYaml = require("js-yaml");
class Relay {
    name;
    platform;
    restoreMode;
    constructor(name, platform,restoreMode) {
        this.name = name
        this.platform = platform
        this.restoreMode = restoreMode
    }

//

    attach(pin) {
        return {componentName: 'switch',payload: 
        {
            switch: {
                platform: this.platform,
                pin: pin,
                id: this.name,
                restore_mode: this.restoreMode
            }
        }
        }
    }
}

export default function relay(name,restoreMode) { 
    return new Relay(name, 'gpio',restoreMode);
}