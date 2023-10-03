/* MIT License

Copyright (c) 2022-present, PROTOFY.XYZ, S.L.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

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