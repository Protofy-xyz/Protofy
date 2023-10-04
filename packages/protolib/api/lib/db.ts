import { Level } from 'level';

const level = require('level-party')
const dbHandlers:any = {}
export const connectDB = (dbPath:string, initialData?: any[] | undefined) => {
    return new Promise((resolve, reject) => {
        console.log('connecting to database: ', dbPath)
        let timer:any;
        if (!(dbPath in dbHandlers)) {
            timer = setTimeout(async () => {
                console.log('Database connection is taking too long, remove lock files and restart this process')
                await db.close()
                process.exit(1)
            }, 5000)
        }

        const db = getDB(dbPath)

        const onDone = async () => {
            clearTimeout(timer)
            console.log('connected to database on: ', dbPath)
            try {
                await db.get('initialized')
                resolve(db)
            } catch (e) {
                console.log('database not initialized, loading initialData...')
                try {
                    const _initialData = initialData ? initialData : []
                    for (let item of _initialData) {
                        await db.put(item.key, item.value)
                        console.log(`Added: ${item.key} -> ${item.value}`)
                    }
                    await db.put('initialized', 'done')
                    resolve(db)
                } catch (err) {
                    console.error('Error initializing the database:', err)
                    reject(err)
                }
            }
        }
        if(db.status == 'open') {
            onDone()
        } else{
            db.on('open', async () => {
                onDone()
            })
    
            db.on('error', (err:any) => {
                clearTimeout(timer)
                console.error('Error connecting to the database: ', dbPath, err)
                reject(err)
            })
        }
    })
}

export const existsKey = async (dbPath: string, key: string) => {
    try {
        const db = getDB(dbPath)
        await db.get(key)
        return true
    } catch (e:any) {
        if(e.notFound) {
            return false
        } else {
            throw e
        }
    }
}
export const getDB = (dbPath:string):Level => {
    if (!(dbPath in dbHandlers)) {
        //@ts-ignore
        dbHandlers[dbPath] = level(dbPath, { valueEncoding: 'json' })
        dbHandlers[dbPath].exists = function(key: string) {
            
        }
        process.on('SIGINT', async () => {
            console.log('Closing database and terminating process...');
            //@ts-ignore
            await dbHandlers[dbPath].close();
            process.exit(0);
        });
    }

    return dbHandlers[dbPath]
}
