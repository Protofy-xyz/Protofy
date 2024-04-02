
import { LoginSchema, RegisterSchema, LoginRequest, RegisterRequest } from 'app/schema';
import { getInitialData } from 'app/initialData'
import { connectDB, existsKey, getDB, handler, checkPassword, hash, genToken, app, getSessionContext } from 'protolib/api'
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import moment from 'moment';
import { generateEvent } from "../bundles/events/eventsLibrary";
import { getLogger } from '../base';

const logger = getLogger()

logger.debug(`API Module loaded: ${__filename.split('.')[0]}`);

const dbPath = '../../data/databases/auth'
const groupDBPath = '../../data/databases/auth_groups'

connectDB(dbPath, getInitialData(dbPath)) //preconnect database
connectDB(groupDBPath, getInitialData(groupDBPath)) //preco

const genNewSession = (data: any) => {
    return {
        user: data,
        token: genToken(data)
    }
}

app.post('/adminapi/v1/auth/login', handler(async (req: any, res: any) => {
    const fail = (request, res) => {
        res.status(401).send('"Incorrect user or password"')
        generateEvent({
            path: 'auth/login/error', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
            user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
            payload: { clientIp: req.get('X-Client-IP') || req.headers['x-client-ip'] } // event payload, event-specific data
        }, getServiceToken())
    }
    const request: LoginRequest = req.body
    try {
        LoginSchema.parse(request)
        if(!await existsKey(dbPath, request.username)) {
            return fail(request, res)
        }

        const storedUser = JSON.parse(await getDB(dbPath).get(request.username))
        if (await checkPassword(request.password, storedUser.password)) {
            //update lastLogin
            await getDB(dbPath).put(storedUser.username, JSON.stringify({ ...storedUser, lastLogin: moment().toISOString() }))
            const group = JSON.parse(await getDB(groupDBPath).get(storedUser.type))
            const newSession = {
                id: storedUser.username,
                type: storedUser.type,
                admin: group.admin ? true : false,
                permissions: [...(group.admin ? ["*"] : []), storedUser.type, ...(group.permissions ?? []), ...(storedUser.permissions ?? [])]
            }
            res.send({
                session: genNewSession(newSession),
                context: await getSessionContext(storedUser.type)
            })
            generateEvent({
                path: 'auth/login/success', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
                user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: { clientIp: req.get('X-Client-IP') || req.headers['x-client-ip'] } // event payload, event-specific data
            }, getServiceToken())
            logger.info({ newSession }, "Session created: " + request.username)
            return
        } else {
            return fail(request, res)
        }
    } catch (error) {
        if(error.name == 'ZodError') {
            return fail(request, res)
        } else {
            res.status(500).send('"Server error"')
        }

        logger.error({ error }, "Login error")
        return
    }
}));

app.get('/adminapi/v1/auth/validate', handler(async (req: any, res: any, session) => {
    res.send(session)
}));

app.post('/adminapi/v1/auth/register', handler(async (req: any, res: any) => {
    const request: RegisterRequest = req.body
    const defaultGroup = "user"
    RegisterSchema.parse(request)
    if (await existsKey(dbPath, request.username)) {
        res.status(500).send({ fieldErrors: { 'username': 'A user with the same email already exists' } });
    } else {
        const { rePassword, password, ...newUserData } = request
        const newUser = {
            ...newUserData,
            createdAt: moment().toISOString(),
            from: 'api'
        }
        await getDB(dbPath).put(request.username, JSON.stringify({...newUser, password: await hash(password)}))
        let group = {
            admin: false,
            permissions: [],
            type: defaultGroup
        };
        try {
            group = JSON.parse(await getDB(groupDBPath).get('user'))
        } catch (error) {
            logger.error({ error }, "Register error: Cannot find group for registered user. Assuming is not admin.")
        }

        generateEvent({
            path: 'auth/register/user', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
            user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {} // event payload, event-specific data
        }, getServiceToken())
        logger.info({ newUserData }, "User created: " + newUserData.username)


        const newSession = {
            id: request.username,
            type: defaultGroup,
            admin: group.admin ? true : false,
            permissions: [...(group.admin ? ["*"] : []), defaultGroup, ...(group.permissions ?? [])]
        }
        res.send({
            session: genNewSession(newSession),
            context: await getSessionContext('user')
        })
        logger.info({ newSession }, "Session created: " + request.username)
    }
}));