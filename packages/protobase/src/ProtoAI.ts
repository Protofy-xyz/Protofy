
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

export class StateElement {
    name: string;
    value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    toXmlString() {
        let value = this.value
        console.log('value: ', value)
        if(value.toXmlString) {
            value = value.toXmlString()
        }
        return '<' + this.name + '>' + value + '</' + this.name + '>\n';
    }
}

export class StateGroup {
    states: StateElement[];
    skipStatesTag: boolean;

    constructor(states: StateElement[], skipStatesTag = false) {
        this.states = states;
        this.skipStatesTag = skipStatesTag;
    }

    merge(stateGroup: StateGroup) {
        this.states = this.states.concat(stateGroup.states);
        return this;
    }

    toXmlString() {
        return (!this.skipStatesTag ? '<states>' : '') + "\n" + this.states.map((state) => "\t" + state.toXmlString()).join("\n") + "\n"+(!this.skipStatesTag ?"</states>\n":"");
    }
}
