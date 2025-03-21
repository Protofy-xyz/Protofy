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
            res.send({ response });
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
            streamAddr: 'IP_HERE',
            streamPort: '8080',
            streamPath: '/video',
            stillPath: '/photo.jpg',
            streamProtocol: 'http://'
        },
        emitEvent: true,
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
            description: 'Detect objects in the camera stream',
            params: {
                url: "camera stream url",
                prompt: "what to detect in the image",
            },
            rulesCode: `return await execute_action("/api/core/v1/vision/detect", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
    })
}

