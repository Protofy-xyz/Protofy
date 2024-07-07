import path from 'path';
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, "..", "..", "..", "..", ".env") });
import { hash } from 'protonode';
import { getDB } from 'app/bundles/storageProviders'
import { CmdRegisterSchema} from 'protolib/schema';
import moment from 'moment';
import { UserModel } from 'protolib/bundles/users/usersSchemas';

if (process.argv.length < 5) {
    console.error('Usage: yarn add-user email password type',process.argv.length)
    process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]
const type = process.argv[4]
const environments = process.argv.length > 5 ? process.argv.slice(5) : ['*']
const dbPath = 'auth'


const addUser = async () => {
    console.log('Adding user: ', username, 'type: ', type)
    const currentDateISO = moment().toISOString();
    try {
        CmdRegisterSchema.parse({username, password, type})
    } catch(e:any) {
        console.error("Error creating user:", e.issues[0].path[0] + ' ' + e.issues[0].message.split(' ').slice(1).join(' '))
        return
    }

    const db = getDB(dbPath)

    if(await db.exists(username)) {
        console.error('Error creating user: A user with the same email already exists');
    } else {
        const userData = {
            username: username, 
            password: await hash(password),
            createdAt: currentDateISO,
            from: 'cmd',
            type: type,
            environments: environments
        }
        const entityModel = UserModel.load(userData)
        await getDB(dbPath).put(username, JSON.stringify(userData))
        console.log("Done!")
    }
}
addUser()
