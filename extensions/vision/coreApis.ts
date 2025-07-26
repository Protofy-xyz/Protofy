import { getServiceToken } from "protonode";
import APIContext from "app/bundles/coreContext";
import { Application } from "express";
import axios from "axios";
import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";
import { getChatGPTApiKey } from '@extensions/chatgpt/coreContext';

async function getImageBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}

async function sendPromptWithImage(prompt, imageUrl) {
    const token = await getChatGPTApiKey();
    if (!token) throw new Error("OpenAI API key not found");
    const imageBase64 = await getImageBase64(imageUrl);

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            temperature: 1,
            model: 'gpt-4o', // o 'gpt-4-vision-preview'
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
            max_tokens: 1024,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.choices[0].message.content;
}

async function sendPromptWithImageLmStudio(prompt, imageUrl) {
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

let frames = {}

export default async (app: Application, context: typeof APIContext) => {

    addCard({
        group: 'vision',
        tag: 'inputs',
        id: 'camera',
        templateName: 'IP Camera',
        name: 'vision_camera',
        defaults: {
            width: 3,
            height: 10,
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

    app.post('/api/core/v1/vision/frame/set', async (req, res) => {
        const { image } = req.body;
        const { id } = req.body;
        if(!id) {
            return res.status(400).send({ error: "ID is required" });
        }
        frames[id as string] = image;
        res.send('/api/core/v1/vision/frame/get?id=' + id);
    })

    addAction({
        group: 'vision',
        name: 'set',
        url: "/api/core/v1/vision/frame/set",
        tag: 'frame',
        description: "set a frame to be used later",
        params: {
            id: "frame id",
            image: "base64 image"
        },
        method: 'post',
        emitEvent: true
    })

    app.get('/api/core/v1/vision/frame/get', async (req, res) => {
        const { id } = req.query;
        if(frames[id as string]) {
            return res.send(frames[id as string]);
        }
        return res.status(404).send({ error: "Frame not found" });
    })

    addAction({
        group: 'vision',
        name: 'get',
        url: "/api/core/v1/vision/frame/get",
        tag: 'frame',
        description: "get a previously set frame",
        params: {
            id: "frame id"
        },
        emitEvent: true
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
            width: 2,
            height: 10,
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
            width: 2,
            height: 10,
            type: "action",
            icon: 'camera',
            name: 'describe',
            description: 'describe image using AI',
            params: {
                url: "image url",
                prompt: "prompt for the image model",
            },
            rulesCode: `return await execute_action("/api/core/v1/vision/describe", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
    })

    addCard({
        group: 'vision',
        tag: 'inputs',
        id: 'vision_web_camera',
        templateName: 'Board Camera',
        name: 'web_camera',
        defaults: {
            "width": 3,
            "height": 12,
            "icon": "table-properties",
            "html": "//@card/react\nfunction Widget(props) {\n    return (\n        <Tinted>\n            <CameraCard params={props.configParams} onPicture={async (picture64) => {\n              const url = document.location.origin + (await execute_action('/api/core/v1/vision/frame/set', {id: 'frame', image: picture64}))\n              execute_action(props.name, {picture: url})\n            }}/>\n        </Tinted>\n    );\n  }\n",
            "name": "camera",
            "description": "Display a React component",
            "type": "action",
            "method": "post",
            "displayButton": true,
            "rulesCode": "return {\r\n    frame: params.picture,\r\n    type: \"frame\",\r\n    key: Math.random()\r\n}",
            "params": {
                "mode": "manual or auto (auto is experimental)",
                "fps": "fps to capture"
            },
            "configParams": {
                "mode": {
                    "visible": false,
                    "defaultValue": "manual"
                },
                "fps": {
                    "visible": false,
                    "defaultValue": "1"
                }
            },
        },
        emitEvent: true,
    })
}

