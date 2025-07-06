import { getPendingResult, z, RegisterSchema, API } from 'protobase';

export const Auth = {
    login: async (username, password, setState) => {
        return API.post('/api/core/v1/auth/login', {username,password}, setState)
    },

    register: async (username, password, rePassword, setState) => {
        try {
            RegisterSchema.parse({username,password,rePassword})
        } catch(e) {
            setState(getPendingResult('error', null, (e as z.ZodError).flatten()))
            return
        }
        
        return API.post('/api/core/v1/auth/register', {username,password,rePassword}, setState)
    }
}