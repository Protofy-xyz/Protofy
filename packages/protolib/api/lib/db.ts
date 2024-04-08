import { Level } from 'level';
import { getLogger } from '../../base';

const logger = getLogger()
const level = require('level-party')

abstract class ProtoDB {
    location: string
    options: any
    constructor(location, options?, context?, name?) {
        this.location = location
        this.options = options
        if(context) {
            context[name] = this
        }
    }

    get status() {
        return "open"
    }

    on(event: string, cb: Function) {
        if(event == 'open') {
            cb()
        }
    }

    abstract get(key: string, options?:any)
    abstract put(key: string, value: string, options?:any)
    abstract del(key: string, options?:any)
    abstract iterator(options?:any)

    async close() {}
    async exists(key: string) {
        try {
            const result = this.get(key)
            return result ? true : false
        } catch (e:any) {
            return false
        }
    }

    static connect(location, options?, context?, name?) {
        throw "Error: derived classes of ProtoDB should implement connect"
    }
}

class ProtoLevelDB extends ProtoDB {
    private db
    constructor(location, options?, context?, name?) {
        super(location, options, context, name);
        this.db = level(location, options);
    }

    get status() {
        return this.db.status
    }

    on(event: string, cb: Function) {
        return this.db.on(event, cb);
    }

    get(key: string, options?) {
        return this.db.get(key, options);
    }

    del(key: string, options?) {
        return this.db.del(key, options);
    }

    put(key: string, value: string, options?) {
        return this.db.put(key, value, options);
    }

    iterator(options?) {
        return this.db.iterator(options);
    }

    close() {
        return this.db.close()
    }

    async exists(key: string) {
        try {
            await this.get(key)
            return true
        } catch (e:any) {
            if(e.name == 'NotFoundError') {
                return false
            } else {
                throw e
            }
        }
    }

    static connect(location, options?) {
        return new ProtoLevelDB(location, options)
    }
}

const dbHandlers:any = {}
export const connectDB = (dbPath:string, initialData?: any[] | undefined) => {
    return new Promise((resolve, reject) => {
        logger.debug(`connecting to database: ${dbPath}`);
        let timer:any;
        if (!(dbPath in dbHandlers)) {
            timer = setTimeout(async () => {
                logger.error('Database connection is taking too long, remove lock files and restart this process')
                await db.close()
                process.exit(1)
            }, 5000)
        }

        const db = getDB(dbPath)

        const onDone = async () => {
            clearTimeout(timer)
            logger.debug(`connected to database on: ${dbPath}`)
            try {
                await db.get('initialized')
                resolve(null)
            } catch (e) {
                logger.info('database not initialized, loading initialData...')
                try {
                    const _initialData = initialData ? initialData : []
                    for (let item of _initialData) {
                        await db.put(item.key, item.value)
                        logger.debug({ key: item.key, value: item.value }, `Added: ${item.key} -> ${JSON.stringify(item.value)}`)
                    }
                    await db.put('initialized', 'done')
                    resolve(null)
                } catch (error) {
                    logger.error({ error }, "Error initializing the database")
                    reject(error)
                }
            }
        }
        if(db.status == 'open') {
            onDone()
        } else{
            db.on('open', async () => {
                onDone()
            })
    
            db.on('error', (error:any) => {
                clearTimeout(timer)
                logger.error({ dbPath, error }, "Error connecting to the database")
                reject(error)
            })
        }
    })
}

export const getDB = (dbPath:string, req?, session?):ProtoDB => {
    if (!(dbPath in dbHandlers)) {
        //@ts-ignore
        dbHandlers[dbPath] = ProtoLevelDB.connect(dbPath, { valueEncoding: 'json' })
        process.on('SIGINT', async () => {
            logger.info('Closing database and terminating process...');
            //@ts-ignore
            await dbHandlers[dbPath].close();
            process.exit(0);
        });
    }

    return dbHandlers[dbPath]
}

export const closeDBS = async () => {
    const keys = Object.keys(dbHandlers)
    for(const key of keys) {
        await dbHandlers[key].close()
    }
}