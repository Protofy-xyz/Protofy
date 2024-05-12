export const getEnv = () => {
    return process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
}