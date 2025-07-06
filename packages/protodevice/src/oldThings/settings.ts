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