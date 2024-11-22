import { Agent } from '../src/Agent';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {HTTPProtocol} from '../src/protocols/http';
import express from 'express';

const app = express();
app.use(express.json());
app.post('/displayInfo', (req, res) => {
    res.send(req.body.name + ', ' + req.body.age);
});


let paramsSchema;
let returnSchema: z.ZodString;
let agent: Agent;
let server;
describe('HTTP Agents', () => {
  beforeEach(() => {
    server = app.listen(12345);
    paramsSchema = z.object({
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
      interface: {
        protocol: {
          type: 'http',
          config: {
            serializer: 'json',
            encoder: 'body',
            method: 'POST',
            url: 'http://localhost:12345/displayInfo'
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

  afterEach(() => {
    server.close();
  })

  it('Should be able to call the function and get the result back', async () => {
    const protocol = HTTPProtocol.create(agent);
    const response = await protocol.send({
        id: 1,
        name: 'John Doe',
        age: 30,
        email: 'a@a.com'
    })
    expect(response.result).toBe('John Doe, 30');
  });

});