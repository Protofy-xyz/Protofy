import { exec } from "child_process";
import exp from "constants";

const path = require('path')
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const token = process.env.SERVICE_TOKEN
describe("Basic tests", () => {

    beforeAll(async () => {

    })
    afterAll(async () => {
        if(process.platform === 'win32') {
            exec(`taskkill /PID ${process.pid} /T /F`, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error killing process tree:', err);
                }
                process.exit(0);
            });
        } else {
            process.kill(process.pid, 'SIGTERM');
        }
    })

    it("starts with an empty event list", async () => {
        const response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(0)
        expect(response.data.items.length).toBe(0)
    })

    it("creates events when receiving a post request with the event", async () => {
        let response = await axios.post('http://localhost:3002/api/core/v1/events?token=' + token, {
            path: 'test/incremental',
            from: 'test',
            user: 'test user',
            payload: { 'c': '0' }
        });
        
        response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(1)
        expect(response.data.items.length).toBe(1)
        expect(response.data.items[0].path).toBe('test/incremental')
        expect(response.data.items[0].from).toBe('test')
        expect(response.data.items[0].user).toBe('test user')
        expect(response.data.items[0].payload.c).toBe('0')
    })

    it("creates 10 events when receiving a post request with the event", async () => {
        for (let i = 1; i < 11; i++) {
            await axios.post('http://localhost:3002/api/core/v1/events?token=' + token, {
                path: 'test/incremental',
                from: 'test',
                user: 'test user',
                payload: { 'c': ''+i }
            });
        }
        const response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(11)
        expect(response.data.items[0].payload.c).toBe('10')
    })

    it("filters events correctly", async () => {
        await axios.post('http://localhost:3002/api/core/v1/events?token=' + token, {
            path: 'test/dummy',
            from: 'test',
            user: 'test user',
            payload: { 'c': '0' }
        });
        let response = await axios.get('http://localhost:3002/api/core/v1/events?filter[path]=test/dummy&token=' + token) 
        expect(response.data.total).toBe(1)
        expect(response.data.items.length).toBe(1)
        expect(response.data.items[0].payload.c).toBe('0')
        expect(response.data.items[0].path).toBe('test/dummy')

        response = await axios.get('http://localhost:3002/api/core/v1/events?filter[path]=test/incremental&token=' + token) 
        expect(response.data.total).toBe(11)
        expect(response.data.items.length).toBe(11)
        for (let i = 1; i < 11; i++) {
            expect(response.data.items[i].path).toBe('test/incremental')
            expect(response.data.items[i].payload.c).toBe(''+(10-i))
        }
    })

    it("accepts events in parallel", async () => {
        const requests = [];
        for (let i = 0; i < 20; i++) {
            requests.push(axios.post(`http://localhost:3002/api/core/v1/events?token=${token}`, {
                path: 'test/flood',
                from: 'test',
                user: 'test user',
                payload: { 'c': ''+i }
            }));
        }
    
        // Ejecutar todas las peticiones en paralelo y capturar los resultados
        const responses = await Promise.all(requests);
    
        // Verificar el contenido de las respuestas
        // console.log('All requests done', responses.map(r => r.data));
        // console.log(`http://localhost:3002/api/core/v1/events?token=${token}`);
    
        // Hacer la petición para obtener el total después de enviar los eventos
        const response = await axios.get(`http://localhost:3002/api/core/v1/events?token=${token}`);
        expect(response.data.items.length).toBe(32);
        expect(response.data.total).toBe(32);
    }, 10000000);

    it("accepts 100 events in parallel in under 2 seconds", async () => {
        const requests = [];
        for (let i = 0; i < 100; i++) {
            requests.push(axios.post(`http://localhost:3002/api/core/v1/events?token=${token}`, {
                path: 'test/flood_100',
                from: 'test',
                user: 'test user',
                payload: { 'c': ''+i }
            }));
        }
    
        // Ejecutar todas las peticiones en paralelo y capturar los resultados
        const responses = await Promise.all(requests);
    
        // Verificar el contenido de las respuestas
        // console.log('All requests done', responses.map(r => r.data));
        // console.log(`http://localhost:3002/api/core/v1/events?token=${token}`);
    
        // Hacer la petición para obtener el total después de enviar los eventos
        const response = await axios.get(`http://localhost:3002/api/core/v1/events?token=${token}`);
        expect(response.data.items.length).toBe(50);
        expect(response.data.total).toBe(132);
    }, 2000);

    it("Reach MAX_EVENTS (500 for tests) events in parallel in under 5 seconds", async () => {
        const requests = [];
        for (let i = 0; i < 368; i++) {
            requests.push(axios.post(`http://localhost:3002/api/core/v1/events?token=${token}`, {
                path: 'test/flood_last',
                from: 'test',
                user: 'test user',
                payload: { 'c': ''+i }
            }));
        }
    
        // Ejecutar todas las peticiones en paralelo y capturar los resultados
        const responses = await Promise.all(requests);
    
        // Verificar el contenido de las respuestas
        // console.log('All requests done', responses.map(r => r.data));
        // console.log(`http://localhost:3002/api/core/v1/events?token=${token}`);
    
        // Hacer la petición para obtener el total después de enviar los eventos
        const response = await axios.get(`http://localhost:3002/api/core/v1/events?token=${token}`);
        expect(response.data.items.length).toBe(50);
        expect(response.data.total).toBe(500);
    }, 5000);
    
    
    it("Should never exceed MAX_EVENTS (500 for tests)", async () => {
        let response = await axios.post('http://localhost:3002/api/core/v1/events?token=' + token, {
            path: 'test/overflow',
            from: 'test',
            user: 'test user',
            payload: { 'c': '0' }
        });
        
        response = await axios.get('http://localhost:3002/api/core/v1/events?token=' + token) 
        expect(response.data.total).toBe(500)
        expect(response.data.items.length).toBe(50)
        expect(response.data.items[0].path).toBe('test/overflow')
        expect(response.data.items[0].from).toBe('test')
        expect(response.data.items[0].user).toBe('test user')
        expect(response.data.items[0].payload.c).toBe('0')
    }, 5000);
})
