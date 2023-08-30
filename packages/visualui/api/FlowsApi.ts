import ApiCaller from 'baseapp/core/ApiCaller'

const getApiCaller = () => {
    return new ApiCaller()
}

class FlowsApi {

    constructor() { }
    static async loadPageContent(pageName: string): Promise<string> {
        const res = await getApiCaller().call(`/v1/pages/${pageName}`, 'GET')
        return res?.data;
    }
    static async saveContent(content: string): Promise<void> {
        await getApiCaller().call(`/v1/pages/`, 'POST', { content: content })
    }
}

export default FlowsApi