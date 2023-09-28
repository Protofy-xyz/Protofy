export const database = async (lib, path, vars) => {
    console.log('Creating database:', path)
    await lib.connectDB(path)
}