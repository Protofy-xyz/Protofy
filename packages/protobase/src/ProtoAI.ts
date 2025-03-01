
export class Action {
    name: string;
    description: string;
    params: any;

    constructor(name: string, description: string, params: any) {
        this.name = name;
        this.description = description;
        this.params = params;
    }

    toXmlString() {
        return '<action name="' + this.name + '" description="' + this.description + '">' + "\n" + Object.entries(this.params).map(([key, value]) => "\t\t<param name=\"" + key + "\" description=\"" + value + "\" />").join("\n") + "\n\t</action>\n";
    }
}

export class ActionGroup {
    actions: Action[];

    constructor(actions: Action[]) {
        this.actions = actions;
    }

    toXmlString() {
        return '<actions>' + "\n" + this.actions.map((action) => "\t" + action.toXmlString()).join("\n") + "\n</actions>\n";
    }
}

interface DataInterface {
    getData(): any;
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
