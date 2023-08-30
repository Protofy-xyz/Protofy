// import ApiCaller from 'baseapp/core/ApiCaller'

const getApiCaller = () => {
    // return new ApiCaller()
}

class EditorApi {
    constructor() { }

    // static async getPages(): Promise<string[]> {
    //     return await getApiCaller().call('/v1/pages', 'GET')
    // }
    // static async createPage(pageName:string, templateName?:string): Promise<any> {
    //     await getApiCaller().call('/v1/pages', 'POST', {name:pageName, templateName: templateName})
    // }
    // static async getTemplates(): Promise<any> {
    //     return await getApiCaller().call('/v1/pages/templates/retrieve', 'GET')
    // }
    // static async loadPageContent(pageName:string): Promise<string> {
    //     if(!pageName) return    
    //     const res = await getApiCaller().call(`/v1/pages/${pageName}`, 'GET')
    //     return res?.data;
    // }

    // static async updatePageContent(pageName:string, content: string): Promise<string> {
    //     const res = await getApiCaller().call(`/v1/pages/${pageName}`, 'POST', {fileContent: content})
    //     return res?.data;
    // }

    // static async deletePage(pageName:string): Promise<void> {
    //     await getApiCaller().call(`/v1/pages/${pageName}/delete`, 'GET')
    // }

    // static async updateTheme(themeData:any): Promise<any> {
    //     await getApiCaller().call('/v1/theme', 'POST', themeData)
    // }
}

export default EditorApi