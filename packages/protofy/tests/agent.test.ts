import { Agent } from '../src/Agent';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

let userSchema: z.ZodObject<any>;
let returnSchema: z.ZodString;
let agent: Agent;

describe('Agents basic behavior', () => {
  beforeEach(() => {
    userSchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      age: z.number().min(18),
      email: z.string().email(),
    });

    returnSchema = z.string()

    agent = new Agent({
      id: 'getDisplayInfo',
      name: 'getDisplayInfo',
      description: 'Get display info of a user',
      tags: ['user', 'display'],
      protocol: {
        type: 'function'
      },
      input: {
        shape: zodToJsonSchema(userSchema, "user"),
        protocol: {
          encoder: 'object' //instead of the default 'positional' for the function protocol
        }
      },
      output: {
        shape: zodToJsonSchema(returnSchema, "displayInfo")
      }
    })
  });

  it('Should be able to remember its agent details after created', () => {
    expect(agent.getId()).toBe('getDisplayInfo');
    expect(agent.getName()).toBe('getDisplayInfo');
    expect(agent.getDescription()).toBe('Get display info of a user');
    expect(agent.getTags()).toEqual(['user', 'display']);
    expect(agent.getProtocol()).toEqual({ type: 'function' });
    expect(agent.getInputShape()).toEqual(zodToJsonSchema(userSchema, "user"))
    expect(agent.getOutputShape()).toEqual(zodToJsonSchema(returnSchema, "displayInfo"))
    expect(agent.getChildren()).toEqual([]);
  });

  it('Should be able to add children to the agent', () => {
    const childAgent = new Agent({
      id: 'childAgent',
      name: 'childAgent',
      description: 'Child agent',
      tags: ['child'],
      protocol: {
        type: 'function'
      },
      input: {
        shape: zodToJsonSchema(userSchema, "user")
      },
      output: {
        shape: zodToJsonSchema(returnSchema, "displayInfo")
      }
    })

    agent.addChildren([childAgent]);
    expect(agent.getChildren()).toEqual([childAgent]);
  });

  it('Should be able to add a single child to the agent', () => {
    const childAgent = new Agent({
      id: 'childAgent',
      name: 'childAgent',
      description: 'Child agent',
      tags: ['child'],
      protocol: {
        type: 'function'
      },
      input: {
        shape: zodToJsonSchema(userSchema, "user")
      },
      output: {
        shape: zodToJsonSchema(returnSchema, "displayInfo")
      }
    })

    agent.addChild(childAgent);
    expect(agent.getChildren()).toEqual([childAgent]);
  });

  it('Should be able to get a child by id', () => {
    const childAgent = new Agent({
      id: 'childAgent',
      name: 'childAgent',
      description: 'Child agent',
      tags: ['child'],
      protocol: {
        type: 'function'
      },
      input: {
        shape: zodToJsonSchema(userSchema, "user")
      },
      output: {
        shape: zodToJsonSchema(returnSchema, "displayInfo")
      }
    })

    agent.addChild(childAgent);
    expect(agent.getChild('childAgent')).toEqual(childAgent);
  });

  it('Should return undefined if the child does not exist', () => {
    expect(agent.getChild('childAgent')).toBeUndefined();
  });

  it('Should combine agent protocol definition with input and output protocol definition, to reduce verbosity', () => {
    expect(agent.getInputProtocol()).toEqual({ type: 'function', encoder: 'object' });
    expect(agent.getOutputProtocol()).toEqual({ type: 'function' });
  });
});