import Handlebars from "handlebars"
import {API} from 'protolib/lib/Api'

export const file = async (lib, path, vars) => {
    const { isGenerative, asset } = vars.data.options.variables;
    console.log('template file executed: ', vars, path)
    const apiPath = path
    if (lib.fs.existsSync(apiPath)) {
        throw "File already exists"
    }

    const templatePath = '../../' + vars?.data?.options?.template
    if (!vars?.data?.options?.template || !lib.fs.existsSync(templatePath)) {
        throw "There is a problem with your workspace definition. No template file was provided for this template."
    }

    const template = (await lib.fs.promises.readFile(templatePath)).toString()
    const templateFunction = Handlebars.compile(template);
    let result = templateFunction({ name: vars.name, ...vars.data?.options?.variables });
    if (isGenerative) {
        const systemPrompt = `You are an expert react frontend developer. A user will provide you with a
        low-fidelity wireframe of an application and you will return 
        a single react file that uses tamagui to create the website. Use creative license to make the application more fleshed out.
       if you need to insert an image, use placehold.co to create a placeholder image. 
       Answer only with code.`;
        const defaultMessages = [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: asset,
                    },
                    `Using the provided image and the following code as template: ${result}.
                     Turn this into component using Tamagui components library.
                     Do not delete react components from the provided template. 
                     Preserve default imports. 
                     Add missing imports for the components you have added.
                     All imports from "tamagui" should be replaced by the alias "@my/ui".
                     Answer only with code`,
                ],
            },
        ]
        try { // Call chatgpt
            const response = await API.post('/adminapi/v1/assistants', {
                gptModel: "gpt-4-vision-preview",
                messages: defaultMessages
            })
            result = response.data.choices[0]?.message.content;
            result = result.split("```jsx")[1].split("```")[0];
        }catch(e){
            console.log("Couldn't generate code using template. ERROR: ", e)
        }
    }
    await lib.fs.promises.writeFile(apiPath, result)
    console.log('New file created with template file: ', apiPath)
}
