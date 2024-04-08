import { Level } from 'level';
import { getLogger } from '../../base';

const logger = getLogger()
const level = require('level-party')

class ProtoDB {
    private db
    constructor(location, options) {
        this.db = level(location, options);
    }

    get status() {
        return this.db.status
    }

    on(...args) {
        return this.db.on(...args);
    }

    get(...args) {
        return this.db.get(...args);
    }

    put(...args) {
        return this.db.put(...args);
    }

    del(...args) {
        return this.db.del(...args);
    }

    batch(...args) {
        return this.db.batch(...args);
    }

    close(...args) {
        return this.db.close(...args);
    }

    iterator(...args) {
        return this.db.iterator(...args);
    }

    async exists(key: string) {
        try {
            await this.db.get(key)
            return true
        } catch (e:any) {
            if(e.name == 'NotFoundError') {
                return false
            } else {
                throw e
            }
        }
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
        dbHandlers[dbPath] = new ProtoDB(dbPath, { valueEncoding: 'json' })
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