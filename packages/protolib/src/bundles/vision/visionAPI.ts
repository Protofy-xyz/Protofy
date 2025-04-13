import { getServiceToken } from "protonode";
import { APIContext } from "../apiContext";
import { Application } from "express";
import axios from "axios";
import { addAction } from "../actions/context/addAction";
import { addCard } from "../cards/context/addCard";

async function getImageBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}

async function sendPromptWithImage(prompt, imageUrl) {
    const imageBase64 = await getImageBase64(imageUrl);

    // Enviar el prompt y la imagen en base64 a LM Studio
    const lmStudioResponse = await axios.post('http://localhost:1234/v1/chat/completions', {
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBase64}`,
                        },
                    },
                    { type: "text", text: prompt }
                ],
            },
        ],
    });

    // Mostrar respuesta
    return lmStudioResponse.data.choices[0].message.content;
}

const locks = {
    "detect": false,
    "categorize": false,
    "count": false
}

export const VisionAPI = async (app: Application, context: typeof APIContext) => {

    addCard({
        group: 'vision',
        tag: 'inputs',
        id: 'camera',
        templateName: 'IP Camera',
        name: 'vision_camera',
        defaults: {
            type: "value",
            icon: 'camera',
            name: 'camera',
            description: 'Camera stream input',
            html: 'return `<img style="width: 100%" src="${data.streamProtocol}${data.streamAddr}:${data.streamPort}${data.streamPath}" />`',
            rulesCode: 'return `${data.streamProtocol}${data.streamAddr}:${data.streamPort}${data.stillPath}`',
            streamAddr: '192.168.10.103',
            streamPort: '8080',
            streamPath: '/video',
            stillPath: '/photo.jpg',
            streamProtocol: 'http://'
        },
        emitEvent: true,
    })

    app.get('/api/core/v1/vision/detect', async (req, res) => {
        if (locks["detect"]) return res.send({ error: "Another detection is in progress" });
        locks["detect"] = true;
        console.log('init')
        try {
            const params = req.query;
            const preprompt = `
            Answer only with a number between 0.0 and 1.0. 0.0 being zero confidence and 1.0 being maximum confidence.
            Check the image provided and answer with the confidence of whether the image contains a:
            
                    `
            const url = params.url;
            const response = parseFloat(await sendPromptWithImage(preprompt + params.prompt, url));
            console.log('CONFIDENCE:', response);
            res.json(response);
        } catch (e) {
            console.error(e);
            res.send({ error: e.message });
        } finally {
            locks["detect"] = false;
        }
    })

    addAction({
        group: 'vision',
        name: 'detect',
        url: "/api/core/v1/vision/detect",
        tag: 'basic',
        description: "basic object detection, give an object description and get a confidence",
        params: {
            url: "image url",
            prompt: "what to detect in the image",
        },
        emitEvent: true
    })

    addCard({
        group: 'vision',
        tag: 'actions',
        id: 'detect',
        templateName: 'Detect objects using AI',
        name: 'vision_detect',
        defaults: {
            type: "action",
            icon: 'camera',
            name: 'detect',
            description: 'Detect objects in the camera stream. returns a confidence value between 0 and 1. It just returns the confidence as a number, without a wrapping object.',
            params: {
                url: "camera stream url",
                prompt: "what to detect in the image",
            },
            rulesCode: `return await execute_action("/api/core/v1/vision/detect", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
    })

    app.get('/api/core/v1/vision/describe', async (req, res) => {
        if (locks["describe"]) return res.send({ error: "Another detection is in progress" });
        locks["describe"] = true;
        console.log('init')
        try {
            const params = req.query;
            const preprompt = `    `
            const url = params.url;
            const response = await sendPromptWithImage(preprompt + params.prompt, url);
            if (params.stateName) {
                context.state.set({ group: 'vision', tag: 'describe', name: params.stateName, value: response, emitEvent: true });
            }
            res.json(response);
        } catch (e) {
            console.error(e);
            res.send({ error: e.message });
        } finally {
            locks["describe"] = false;
        }
    })

    addAction({
        group: 'vision',
        name: 'describe',
        url: "/api/core/v1/vision/describe",
        tag: 'basic',
        description: "image description using AI",
        params: {
            url: "image url",
            prompt: "promt for the image model",
            stateName: "state name to store the result"
        },
        emitEvent: true
    })

    addCard({
        group: 'vision',
        tag: 'actions',
        id: 'describe',
        templateName: 'describe image using AI',
        name: 'vision_describe',
        defaults: {
            type: "action",
            icon: 'camera',
            name: 'describe',
            description: 'describe image using AI',
            params: {
                url: "camera stream url",
                prompt: "prompt for the image model",
                stateName: "state name to store the result, if empty the result will not be stored in a state"
            },
            rulesCode: `return await execute_action("/api/core/v1/vision/describe", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
    })
}

