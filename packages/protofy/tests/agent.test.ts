import { Agent } from '../src/Agent';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

let paramsSchema;
let returnSchema: z.ZodString;
let agent: Agent;
let childAgent: Agent;

describe('Agents basic behavior', () => {
  beforeEach(() => {
    paramsSchema = z.tuple([z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      age: z.number().min(18),
      email: z.string().email(),
    })]);

    returnSchema = z.string()

    childAgent = new Agent({
      id: 'childAgent',
      name: 'childAgent',
      description: 'Child agent',
      tags: ['child']
    });

    agent = Agent.create({
      id: 'getDisplayInfo',
      name: 'getDisplayInfo',
      description: 'Get display info of a user',
      tags: ['user', 'display'],
      interface: {
        protocol: {
          type: 'function',
          config: {
            fn: (user) => {
              return user.name + ', ' + user.age
            },
            auth: 'test',
            authOptions: {
              testoption: 'testoption'
            }
          }
        },
        input: {
          shape: zodToJsonSchema(paramsSchema, "params"),
          protocol: {
            config: {test: 'test'} 
          }
        },
        output: {
          shape: zodToJsonSchema(returnSchema, "displayInfo")
        }
      }
    })
  });

  it('Should be able to remember its agent details after created', () => {
    expect(agent.getId()).toBe('getDisplayInfo');
    expect(agent.getName()).toBe('getDisplayInfo');
    expect(agent.getDescription()).toBe('Get display info of a user');
    expect(agent.getTags()).toEqual(['user', 'display']);
    expect(agent.getAuth()).toBe('test');
    expect(agent.getAuthOptions()).toEqual({testoption: 'testoption'});
    expect(agent.getProtocol().type).toEqual('function');
    expect(agent.getProtocol().config).toHaveProperty('fn');
    expect(agent.getInputShape()).toEqual(zodToJsonSchema(paramsSchema, "params"))
    expect(agent.getOutputShape()).toEqual(zodToJsonSchema(returnSchema, "displayInfo"))
    expect(agent.getChildren()).toEqual([]);
  });

  it('Should be able to add children to the agent', () => {
    agent.addChildren([childAgent]);
    expect(agent.getChildren()).toEqual([childAgent]);
  });

  it('Should be able to add a single child to the agent', () => {
    agent.addChild(childAgent);
    expect(agent.getChildren()).toEqual([childAgent]);
  });

  it('Should be able to get a child by id', () => {
    agent.addChild(childAgent);
    expect(agent.getChild('childAgent')).toEqual(childAgent);
  });

  it('Should return undefined if the child does not exist', () => {
    expect(agent.getChild('childAgent')).toBeUndefined();
  });

  it('Should return combined agent protocol from the parent', () => {
    agent.addChild(childAgent);
    const childProtocol = agent.getChild('childAgent').getProtocol()
    expect(childProtocol.config).toHaveProperty('fn')
    expect(childProtocol.type).toEqual('function');
  });

  it('Should combine agent protocol definition with input and output protocol definition, to reduce verbosity', () => {
    const protocol = agent.getInputProtocol()
    expect(protocol.config.test).toEqual('test');
    expect(protocol.config).toHaveProperty('fn')
    expect(agent.getOutputProtocol().type).toEqual('function');
  });
});