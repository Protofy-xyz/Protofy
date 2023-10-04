
import { LoginSchema, RegisterSchema, LoginRequest, RegisterRequest } from 'app/schema';
import {getInitialData} from 'app/initialData'
import {connectDB, existsKey, getDB, handler, checkPassword, hash, genToken, app} from 'protolib/api'

console.log(`API Module loaded: ${__filename.split('.')[0]}`);

const dbPath = '../../data/databases/auth'
connectDB(dbPath, getInitialData(dbPath)) //preconnect database

const genNewSession = (data:any) => {
    return {
        user : data,
        token: genToken(data)
    }
}

app.post('/adminapi/v1/auth/login', handler(async (req:any, res:any) => {
    const request:LoginRequest = req.body
    LoginSchema.parse(request)
    try {
        const storedUser = JSON.parse(await getDB(dbPath).get(request.username))
        if(await checkPassword(request.password, storedUser.password)) {
            res.send(genNewSession({id:storedUser.username, type: storedUser.type}))
            return
        }
    } catch(e) {
        console.log('ERROR: ',e)
    }
    res.status(500).send('"Incorrect user or password"')
}));

app.post('/adminapi/v1/auth/register', handler(async (req:any, res:any) => {
    const request:RegisterRequest = req.body
    RegisterSchema.parse(request)
    if(await existsKey(dbPath, request.username)) {
        res.status(500).send({fieldErrors: {'username': 'A user with the same email already exists'}});
    } else {
        const {rePassword, ...newUserData} = request
        await getDB(dbPath).put(request.username, JSON.stringify({
            ...newUserData, 
            password: await hash(newUserData.password),
            type: 'user'
        }))
        res.send(genNewSession({id:request.username, type: "user"}))
    }
}));