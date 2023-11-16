import { genToken } from './crypt';

export const serviceToken = genToken({id:'system', type: 'system', admin: true})