import { Level } from 'level';
import { getLogger } from '../../base';

const logger = getLogger()
const level = require('level-party')
const dbHandlers:any = {}

type ProtoDBConfig = {
    context?: any,
    name?: string,
    disablePooling?: boolean
}
abstract class ProtoDB {
    location: string
    options: any //database-level options. If the connector is for leveldb, those are leveldb options
    config: ProtoDBConfig //configuration of the behaviour of the OOP class (disable cache, context and names...)
    constructor(location, options?, config?) {
        this.location = location
        this.options = options
        this.config = config ?? {}

        if(config && config.context && config.name) {
            config.context[config.name] = this
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

    static getInstance(location, options?, config?: ProtoDBConfig) {
        throw "Error: derived classes of ProtoDB should implement getInstance"
    }

    static connect(location, options?, config?:ProtoDBConfig) {
        if(!config?.disablePooling) {
            if (!(location in dbHandlers)) {
                //@ts-ignore
                dbHandlers[location] = this.getInstance(location, options, config)
                process.on('SIGINT', async () => {
                    logger.info('Closing database and terminating process...');
                    //@ts-ignore
                    await dbHandlers[location].close();
                    process.exit(0);
                });
            }
        
            return dbHandlers[location]
        } else {
            return this.getInstance(location, options, config)
        }
    }

    static initDB(dbPath:string, initialData=[], options?) {
        return new Promise((resolve, reject) => {
            logger.debug(`connecting to database: ${dbPath}`);
    
            const db = getDB(dbPath)
    
            const onDone = async () => {
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
                    logger.error({ dbPath, error }, "Error connecting to the database")
                    reject(error)
                })
            }
        })
    }
}

class ProtoLevelDB extends ProtoDB {
    private db
    constructor(location, options?, config?:ProtoDBConfig) {
        super(location, options, config);
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

    static getInstance(location, options?, config?:ProtoDBConfig) {
        return new ProtoLevelDB(location, options, config)
    }
}

export const connectDB = (dbPath:string, initialData?: any[] | undefined) => {
    return ProtoLevelDB.initDB(dbPath, initialData)
}

export const getDB = (dbPath:string, req?, session?):ProtoDB => {
    return ProtoLevelDB.connect(dbPath, { valueEncoding: 'json' })
}

export const closeDBS = async () => {
    const keys = Object.keys(dbHandlers)
    for(const key of keys) {
        await dbHandlers[key].close()
    }
}