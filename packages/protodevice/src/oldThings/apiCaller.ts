import Settings from './settings';

class ApiCaller {
    token: string;
    apiUrl: string;
    constructor(token?: string, apiUrl?: string) {
        this.token = token ? token : "";
        this.apiUrl = apiUrl ? apiUrl : Settings.getApiURL()
    }

    async call(url: string, method: string, params?: object, prefix?: string): Promise<any> {

        var fetchParams: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (params) {
            fetchParams.body = JSON.stringify(params);
        }

        let separator = '?';
        if (url.indexOf('?') != -1) {
            separator = '&';
        }

        var defUrl = url + (this.token ? separator + "token=" + this.token : "");
        var urlPrefix = prefix ? prefix : Settings.getApiURL()

        return fetch(urlPrefix + defUrl, fetchParams)
            .then(function (response) {
                if (!response.ok) {
                    const errorObject = {
                        "statusCode": response.status,
                        "status": "rejected",
                        "statusText": response.statusText,
                        "url": response.url
                    }
                    throw Error(JSON.stringify(errorObject));
                }
                return response;
            })
            .then(response => response.json())
    }

    async uploadFile(url: string, formData: FormData): Promise<any> {
        return fetch(url, {
            method: 'post',
            body: formData
        })
    }
}

export default ApiCaller;