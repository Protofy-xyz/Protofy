const path = require('path')
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const token = process.env.SERVICE_TOKEN
describe("Basic tests", () => {

    beforeAll(async () => {

    })
    afterAll(async () => {

    })

    it("starts with an empty event list", async () => {
        const response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(0)
    })

    it("creates events when receiving a post request with the event", async () => {
        await axios.post('http://localhost:3002/api/core/v1/events?token=' + token, {
            path: 'test/events',
            from: 'test',
            user: 'test user',
            payload: { 'testpayload': 'value' }
        });
        const response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(1)
        expect(response.data.items[0].path).toBe('test/events')
        expect(response.data.items[0].from).toBe('test')
        expect(response.data.items[0].user).toBe('test user')
        expect(response.data.items[0].payload.testpayload).toBe('value')
    })
})
