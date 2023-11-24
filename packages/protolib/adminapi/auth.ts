
import { LoginSchema, RegisterSchema, LoginRequest, RegisterRequest } from 'app/schema';
import {getInitialData} from 'app/initialData'
import {connectDB, existsKey, getDB, handler, checkPassword, hash, genToken, app, getSessionContext} from 'protolib/api'
import {getServiceToken} from 'protolib/api/lib/serviceToken'
import moment from 'moment';
import { generateEvent } from "../bundles/events/eventsLibrary";

console.log(`API Module loaded: ${__filename.split('.')[0]}`);

const dbPath = '../../data/databases/auth'
const groupDBPath = '../../data/databases/auth_groups'

connectDB(dbPath, getInitialData(dbPath)) //preconnect database
connectDB(groupDBPath, getInitialData(groupDBPath)) //preco

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
            //update lastLogin
            await getDB(dbPath).put(storedUser.username, JSON.stringify({...storedUser, lastLogin: moment().toISOString()}))
            const group = JSON.parse(await getDB(groupDBPath).get(storedUser.type))
            res.send({session: genNewSession({id:storedUser.username, type: storedUser.type, admin: group.admin?true:false}), context: await getSessionContext(storedUser.type)})
            generateEvent({
                path: 'auth/login/success', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {clientIp: req.get('X-Client-IP') || req.headers['x-client-ip']} // event payload, event-specific data
            }, getServiceToken())
            return
        }
    } catch(e) {
        console.log('ERROR: ',e)
    }
    generateEvent({
        path: 'auth/login/error', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: 'api', // system entity where the event was generated (next, api, cmd...)
        user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {clientIp: req.get('X-Client-IP') || req.headers['x-client-ip']} // event payload, event-specific data
    }, getServiceToken())
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
            createdAt: moment().toISOString(),
            from: 'api',
            type: 'user'
        }))
        let group = {
            admin: false
        };
        try {
            group = JSON.parse(await getDB(groupDBPath).get('user'))
        } catch (e) {
            console.error('Error finding group for registered user. Assuming is not admin. Error: ', e)
        }

        generateEvent({
            path: 'auth/register/user', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'api', // system entity where the event was generated (next, api, cmd...)
            user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {} // event payload, event-specific data
        }, getServiceToken())
        res.send({session: genNewSession({id:request.username, type: "user", admin: group.admin?true:false}), context: await getSessionContext('user')})
    }
}));