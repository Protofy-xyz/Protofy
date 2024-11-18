import { SchemaObject, Ajv } from "ajv";
import { z } from "zod";

// Compile a generic JSON Schema validator using Ajv
const ajv = new Ajv();
const validateSchemaObject = ajv.compile({ type: "object" });

const AgentProtocolSchema = z.object({
    type: z.string(), // function, http, mqtt
    config: z.object({
        serializer: z.string().optional(), // json, xml, value (for local function calls)
        serializerOptions: z.record(z.any()).optional(), // options for the serializer
        encoder: z.string().optional(), // body, query, path, arguments, return, callback...
        encoderOptions: z.record(z.any()).optional(), // options for the encoder
        //any other protocol specific options like host, port, path, method, headers, etc.
    }).catchall(z.any()).optional(), // Allow any other properties in config
});

const AgentIOSchema = z.object({
    shape: z.custom<SchemaObject>((value) => {
        // Use Ajv to validate the value
        return validateSchemaObject(value);
    }, "SchemaObject"),
    protocol: AgentProtocolSchema.optional()
})

const AgentInterfaceSchema = z.object({
    protocol: AgentProtocolSchema.optional(),
    input: AgentIOSchema.optional(),
    output: AgentIOSchema.optional()
})

const AgentSchema = z.object({
    id: z.string(), // Required string
    name: z.string().optional(), // Optional string
    description: z.string().optional(), // Optional string
    tags: z.array(z.string()).optional(), // Optional array of strings
    interface: AgentInterfaceSchema.optional() // Optional interface
})

// Infer the TypeScript type
export type AgentData = z.infer<typeof AgentSchema>;
export type AgentProtocolData = z.infer<typeof AgentProtocolSchema>;
export type AgentIOData = z.infer<typeof AgentIOSchema>;
export type AgentInterfaceData = z.infer<typeof AgentInterfaceSchema>;

export class Agent {
    data: AgentData;
    children: Agent[];
    interface: AgentInterface | undefined;
    parent: Agent | undefined;
    constructor(data: AgentData, children: Agent[] = [], parent: Agent = undefined, ) {
        this.data = data;
        this.children = children;
        this.interface = data.interface && new AgentInterface(data.interface, this);
        this.parent = parent;
    }

    getName() {
        return this.data.name
    }

    getId() {
        return this.data.id
    }

    getDescription() {
        return this.data.description
    }

    getTags() {
        return this.data.tags
    }

    getProtocol() {
        const protocol = this.interface?.getProtocol()
        if(this.parent) {
            return {
                ...this.parent.getProtocol(),
                ...protocol
            }
        }
        return protocol
    }

    getInputShape() {
        return this.interface?.getInput()?.getShape()
    }

    getInputProtocol() {
        return this.interface?.getInput()?.getProtocol()
    }

    getOutputShape() {
        return this.interface?.getOutput()?.getShape()
    }

    getOutputProtocol() {
        return this.interface?.getOutput()?.getProtocol()
    }

    addChildren(agents: Agent[]) {
        agents.forEach(agent => agent.setParent(this));
        this.children.push(...agents);
    }

    getChildren() {
        return this.children;
    }

    addChild(agent: Agent) {
        agent.setParent(this);
        this.children.push(agent);
    }

    getChild(id: string) {
        return this.children && this.children.find(agent => agent.data.id === id);
    }

    setParent(agent: Agent) {
        this.parent = agent;
    }
}

export class AgentInterface {
    input: AgentIOInterface;
    output: AgentIOInterface;
    protocol: AgentProtocolData;
    
    constructor(data: AgentInterfaceData, agent: Agent) {
        this.input = data.input && new AgentInputInterface(data.input, agent);
        this.output = data.output && new AgentOutputInterface(data.output, agent);
        this.protocol = data.protocol;
    }

    getProtocol() {
        return this.protocol
    }

    getInput() {
        return this.input
    }

    getOutput() {
        return this.output
    }
}

export class AgentIOInterface {
    shape: SchemaObject;
    protocol: AgentProtocolData;
    agent: Agent;
    constructor(data: AgentIOData, agent: Agent) {
        this.shape = data.shape;
        this.protocol = data.protocol;
        this.agent = agent;
    }

    getShape() {
        return this.shape;
    }

    getProtocol() {
        return {
            ...this.agent.getProtocol(),
            config: {
                ...this.agent.getProtocol().config,
                ...this.protocol?.config
            }
        }
    }
}

export class AgentInputInterface extends AgentIOInterface {
    constructor(data: AgentIOData, agent: Agent) {
        super(data, agent);
    }
}

export class AgentOutputInterface extends AgentIOInterface {
    constructor(data: AgentIOData, agent: Agent) {
        super(data, agent);
    }
}