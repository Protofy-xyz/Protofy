import { Agent } from '../src/Agent';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import functionRunner from '../src/runners/function';

let paramsSchema;
let returnSchema: z.ZodString;
let agent: Agent;

describe('Function Agents', () => {
  beforeEach(() => {
    paramsSchema = z.tuple([z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      age: z.number().min(18),
      email: z.string().email(),
    })]);

    returnSchema = z.string()

    agent = new Agent({
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
            }
          }
        },
        input: {
          shape: zodToJsonSchema(paramsSchema, "params")
        },
        output: {
          shape: zodToJsonSchema(returnSchema, "displayInfo")
        }
      }
    })
  });

  it('Should be able to call the function and get the result back', () => {
    expect(functionRunner(agent, {
        id: 1,
        name: 'John Doe',
        age: 30,
        email: 'a@a.com'
    }).result).toBe('John Doe, 30');
  });

});