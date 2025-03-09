interface DataInterface {
    getData(): any;
}

export class Action implements DataInterface {
    automationData: any;

    constructor(automationData) {
        this.automationData = automationData;
    }

    getData(raw?: boolean) {
        if (raw) {
            return this.automationData;
        }
        return {action: {
            ...this.automationData
        }}
    }
}

export class ActionGroup implements DataInterface {
    actions: Action[];
    name: string;
    constructor(actions: Action[], name: string) {
        this.actions = actions;
        this.name = name;
    }
    
    getActionByName(name: string) {
        return this.actions.find((action) => action.automationData.name === name)
    }

    getActions() {
        return this.actions;
    }

    getData() {
        return {[this.name]: this.actions.map((action) => action.getData())}
    }
}


export class StateElement implements DataInterface {
    name: string;
    value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    getData() {
        let value = this.value
        return {[this.name]: value};
    }
}

export class StateGroup implements DataInterface {
    name: string
    states: DataInterface[];
    skipStatesTag: boolean;

    constructor(states: DataInterface[], name: string) {
        this.states = states;
        this.name = name;
    }

    addState(state: DataInterface) {
        this.states.push(state)
        return this;
    }

    getDataArray() {
        return this.states.map((state) => state.getData())
    }

    getDataObject() {
        let data = {}
        this.states.forEach((state) => {
            data = {...data, ...state.getData()}
        })
        return data;
    }
    
    getData() {
        return {[this.name]: this.states.map((state) => state.getData())}
    }
}
