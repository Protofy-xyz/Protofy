const settings = {
    set: async function (key, value) {
        return await API.post('/api/core/v1/settings', {
            name: key,
            value: value
        })
    },
    del: async function (key) {
        return await API.get('/api/core/v1/settings/'+key+'/delete')
    },
    get: async function (key) {
        return await API.get('/api/core/v1/settings/'+key)
    },
}