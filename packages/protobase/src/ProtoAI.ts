interface DataInterface {
    getData(): any;
}

export class Action implements DataInterface {
    name: string;
    description: string;
    params: any;

    constructor(name: string, description: string, params: any) {
        this.name = name;
        this.description = description;
        this.params = params;
    }

    getData() {
        return {action: {
            name: this.name,
            description: this.description,
            params: this.params
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
        console.log('value: ', value)
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

    getData() {
        return {[this.name]: this.states.map((state) => state.getData())}
    }
}
