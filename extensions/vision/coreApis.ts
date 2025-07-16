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
            "width": 2,
            "height": 8,
            "icon": "table-properties",
            "html": "//@react\nreactCard(`\n  function Widget(props) {\n    return (\n        <Tinted>\n          <View className=\"no-drag\">\n            <CameraCard params={props.configParams} onPicture={(picture64) => {\n              execute_action(props.name, {picture: picture64})\n            }}/>\n          </View>\n        </Tinted>\n    );\n  }\n\n`, data.domId, data)\n",
            "name": "camera",
            "description": "Display a React component",
            "type": "action",
            "method": "post",
            "displayButton": true,
            "rulesCode": "return params.picture",
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

