export const database = async (lib, params) => {
    console.log('template database executed: ', params)
    const name = params.name.replace(/[^a-zA-Z0-9_-]/g, '');
    const path = params.data.path.replace(/\.\./g, '')
    const fullpath = '../..'+params.data.path+"/"+name
    console.log('Creating database:', fullpath)
    await lib.connectDB(fullpath)
}