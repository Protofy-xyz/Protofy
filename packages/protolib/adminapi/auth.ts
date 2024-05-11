
import { LoginSchema, RegisterSchema, LoginRequest, RegisterRequest } from '../schema';
import { getInitialData } from 'app/initialData'
import { handler, checkPassword, hash, genToken, app, getSessionContext } from 'protolib/api'
import { connectDB, getDB } from 'app/bundles/storageProviders';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import moment from 'moment';
import { generateEvent } from "../bundles/events/eventsLibrary";
import { getLogger } from '../base';
import { UserModel } from '../bundles/users';
import {SiteConfig} from 'app/conf'

const logger = getLogger()

logger.debug(`API Module loaded: ${__filename.split('.')[0]}`);

const dbPath = 'auth'
const groupDBPath = 'auth_groups'

connectDB(dbPath, getInitialData(dbPath), {
    indexes: UserModel.getIndexes(),
    groupIndexes: UserModel.getGroupIndexes()
}) //preconnect database

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
            user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {username: request.username, clientIp: req.get('X-Client-IP') || req.headers['x-client-ip'] } // event payload, event-specific data
        }, getServiceToken())
    }
    const request: LoginRequest = req.body
    try {
        LoginSchema.parse(request)
        const db = getDB(dbPath, req)
        if(!await db.exists(request.username)) {
            return fail(request, res)
        }

        const storedUser = JSON.parse(await db.get(request.username))
        const entityModel = UserModel.load(storedUser)
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
    if(!SiteConfig.signupEnabled) {
        res.status(403).send('Signup is disabled');
        return
    }

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
            createdAt: moment().toISOString(),
            from: 'api'
        }
        const entityModel = UserModel.load(newUser)
        await db.put(request.username, JSON.stringify({...newUser, password: await hash(password)}))

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