
import { LoginSchema, RegisterSchema, LoginRequest, RegisterRequest } from '../schema';
import { getInitialData } from 'app/initialData'
import { handler, checkPassword, hash, genToken, getApp, getSessionContext, getServiceToken } from 'protonode'
import { connectDB, getDB } from 'app/bundles/storageProviders';
import moment from 'moment';
import { generateEvent } from "../bundles/events/eventsLibrary";
import { getLogger } from 'protobase';
import { UserModel } from '../bundles/users';
import {SiteConfig} from 'app/conf'
import { getDBOptions } from 'protonode';

const logger = getLogger()

const app = getApp()

logger.debug(`API Module loaded: ${__filename.split('.')[0]}`);

const dbPath = 'auth'
const groupDBPath = 'auth_groups'

connectDB(dbPath, getInitialData(dbPath), getDBOptions(UserModel)) //preconnect database

const genNewSession = (data: any) => {
    return {
        user: data,
        token: genToken(data)
    }
}

app.post('/adminapi/v1/auth/login', handler(async (req: any, res: any) => {
    const request: LoginRequest = req.body
    const env = req.query.env ?? 'prod'
    const fail = (msg) => {
        res.status(401).send('"'+msg+'"')
        generateEvent({
            environment: env,
            path: 'auth/login/error', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
            user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {reason: msg, username: request.username, clientIp: req.get('X-Client-IP') || req.headers['x-client-ip'] } // event payload, event-specific data
        }, getServiceToken())
    }
    try {
        LoginSchema.parse(request)
        const db = getDB(dbPath, req)
        if(!await db.exists(request.username)) {
            return fail('Incorrect user or password')
        }

        const storedUser = JSON.parse(await db.get(request.username))
        const entityModel = UserModel.load(storedUser)

        if(!entityModel.hasEnvironment(env)) {
            return fail("This user is not registered for this environment")
        }

        if (await checkPassword(request.password, storedUser.password)) {
            //update lastLogin
            await db.put(storedUser.username, JSON.stringify({ ...storedUser, lastLogin: moment().toISOString() }))
            let group
            try {
                group = JSON.parse(await getDB(groupDBPath).get(storedUser.type))
            } catch(e) {
                logger.error({error: e, user: request.username, group: storedUser.type}, "Error reading group for user")
                throw "Error reading group for user: "+request.username
            }
            const newSession = {
                id: storedUser.username,
                environments: storedUser.environments,
                type: storedUser.type,
                admin: group.admin ? true : false,
                permissions: [...(group.admin ? ["*"] : []), storedUser.type, ...(group.permissions ?? []), ...(storedUser.permissions ?? [])]
            }
            res.send({
                session: genNewSession(newSession),
                context: await getSessionContext(storedUser.type)
            })
            generateEvent({
                environment: env,
                path: 'auth/login/success', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
                user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: { clientIp: req.get('X-Client-IP') || req.headers['x-client-ip'] } // event payload, event-specific data
            }, getServiceToken())
            logger.info({ newSession }, "Session created: " + request.username)
            return
        } else {
            return fail('Incorrect user or password')
        }
    } catch (error) {
        if(error.name == 'ZodError') {
            return fail('Incorrect user or password')
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
    if(!SiteConfig.signupEnabled) {
        res.status(403).send('Signup is disabled');
        return
    }
    const env = req.query.env ?? 'prod'
    const request: RegisterRequest = req.body
    const defaultGroup = "user"
    RegisterSchema.parse(request)
    const db = getDB(dbPath, req)
    if (await db.exists(request.username)) {
        res.status(500).send({ fieldErrors: { 'username': 'A user with the same email already exists' } });
    } else {
        const { rePassword, password, ...newUserData } = request
        const newUser = {
            ...newUserData,
            from: 'signup',
            environments: [env], 
            password: await hash(password)
        }
        const entityModel = UserModel.load(newUser).create()
        const userData = JSON.stringify({...entityModel.getData(), password: await hash(password)})

        await db.put(request.username, userData)

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
            environment: env,
            path: 'auth/register/user', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
            user: request.username, // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {environments: [req.query.env ?? 'prod']} // event payload, event-specific data
        }, getServiceToken())
        logger.info({ newUserData }, "User created: " + newUserData.username)


        const newSession = {
            id: request.username,
            type: defaultGroup,
            admin: group.admin ? true : false,
            permissions: [...(group.admin ? ["*"] : []), defaultGroup, ...(group.permissions ?? [])],
            environments: [env]
        }
        res.send({
            session: genNewSession(newSession),
            context: await getSessionContext('user')
        })
        logger.info({ newSession }, "Session created: " + request.username)
    }
}));

export default 'auth'