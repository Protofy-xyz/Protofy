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

// import Storage from './storage';
// import getEnvVars, {getMode} from 'internalapp/environments';

const getEnvVars = ()=>{
    return {apiUrl: "http://localhost",imagesUrl: "test"}
}

const { apiUrl, imagesUrl } = getEnvVars();
// var currentUser: User;

// var getCurrentUser = async (): Promise<User> => {
//     var data = await Storage.read('user');
//     currentUser = User.prototype.load(data);
//     return currentUser;
// }

var Settings = {
    // currentUser: () : User => currentUser,

    // getCurrentUser: getCurrentUser,


    // setCurrentUser: async (user: User): Promise<void> => {
    //     currentUser = user;
    //     return await Storage.write('user', user);
    // },

    // logout: async () => {
    //     return await Storage.clear('user');
    // },

    getApiURL: () => {
        return apiUrl;
    },

    getMqttURL: () => {
        var protocol = "ws" 
        if(apiUrl.startsWith('https')){
            protocol = protocol + 's';
        }
        const parts = apiUrl.split(':');
        parts.shift();
        const pathElements = parts.join().split('/');
        pathElements[pathElements.length-1] = 'ws';
        return protocol+':'+pathElements.join('/')
    },
    
    getImagesURL: () => {
        return imagesUrl;
    },

    // getMode: () => {
    //     return getMode();
    // }
}

export default Settings;