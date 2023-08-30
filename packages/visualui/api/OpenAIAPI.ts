import ApiCaller from 'baseapp/core/ApiCaller'

const getApiCaller = () => {
    return new ApiCaller()
}

class OpenAIAPI {
    constructor() { }

    static async generateExampleText(description: string): Promise<any> {
        const data = await getApiCaller().call('/v1/openAI/projects', 'POST', { description: description })
        return data
    }
}

export default OpenAIAPI