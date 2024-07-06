import { API } from "protobase"
import { RegisterSchema } from 'app/schema';
import { getPendingResult, z } from 'protobase';

export const Auth = {
    login: async (username, password, environment, setState) => {
        return API.post('/adminapi/v1/auth/login'+(environment == 'prod' ? '': '?env='+environment), {username,password}, setState)
    },

    register: async (username, password, rePassword, environment, setState) => {
        try {
            RegisterSchema.parse({username,password,rePassword})
        } catch(e) {
            setState(getPendingResult('error', null, (e as z.ZodError).flatten()))
            return
        }
        
        return API.post('/adminapi/v1/auth/register'+(environment == 'prod' ? '': '?env='+environment), {username,password,rePassword}, setState)
    }
}