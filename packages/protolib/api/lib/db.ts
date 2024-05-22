import { getLogger } from '../../base';
import path from 'path'
import fs from 'fs'

const level = require('level-party')
const sublevel = require('subleveldown')

const logger = getLogger()
const dbHandlers: any = {}

const optionsTable = {}

export type ProtoDBConfig = {
    context?: any,
    name?: string
}
export abstract class ProtoDB {
    capabilities: string[]
    location: string
    options: any //database-level options. If the connector is for leveldb, those are leveldb options
    config: ProtoDBConfig //configuration of the behaviour of the OOP class (disable cache, context and names...)
    constructor(location, options?, config?) {
        this.location = location
        this.options = options
        this.config = config ?? {}
        this.capabilities = []
        if (config && config.context && config.name) {
            config.context[config.name] = this
        }
    }

    get status() {
        return "open"
    }

    on(event: string, cb: Function) {
        if (event == 'open') {
            cb()
        }
    }

    hasCapability(capability: string) {
        return this.capabilities.includes(capability)
    }

    abstract get(key: string, options?: any)
    abstract put(key: string, value: string, options?: any)
    abstract del(key: string, options?: any)
    abstract iterator(options?: any)

    async close() { }
    async exists(key: string) {
        try {
            const result = this.get(key)
            return result ? true : false
        } catch (e: any) {
            return false
        }
    }

    static getInstance(location, options?, config?: ProtoDBConfig) {
        throw "Error: derived classes of ProtoDB should implement getInstance"
    }

    static connect(location, options?, config?: ProtoDBConfig) {
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
    }

    static async initDB(dbPath: string, initialData = {}, options?) {
        throw new Error('Static method initDB must be implemented');
    }
}

export class ProtoLevelDB extends ProtoDB {
    private rootDb
    private db
    private batchCounter
    private batchTimer
    private batchLimit
    private batchTimeout
    private batch
    constructor(location, options?, config?: ProtoDBConfig) {
        super(location, options, config);
        this.capabilities = ['pagination', 'groupBySingle']
        this.rootDb = level(location, options);
        this.db = sublevel(this.rootDb, 'values')
        const dbOptions = optionsTable[location] ?? {}
        this.batch = dbOptions.batch ?? false
        this.batchLimit = dbOptions.batchLimit ?? 5
        this.batchTimeout = dbOptions.batchTimeout ?? 10000
        this.batchCounter = 0
        this.batchTimer = null
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
        const result = this.db.del(key, options)
        this.regenerateIndexes()
        return result
    }

    async count(filter?) {
        if(filter) {
            const groupDb = sublevel(this.rootDb, 'group_' + filter.key)
            const groupCollection = sublevel(groupDb, filter.value)
            const counter = sublevel(groupCollection, 'counter')
            return await counter.get('total')
        }
        
        const counter = sublevel(this.rootDb, 'counter')
        return await counter.get('total')
    }

    async getIndexedKeys() {
        try {
            const indexTable = sublevel(this.rootDb, 'indexTable')
            return JSON.parse(await indexTable.get('indexes')).keys
        } catch (e) {
            logger.error({ db: this.location }, 'Error reading indexes for database: ' + this.location)
        }

        return []
    }

    async hasGroupIndexes(groupIndexes) {
        const storedGroupIndexes = await this.getGroupIndexes()
        return groupIndexes.every(gi => storedGroupIndexes.find(sgi => sgi.key == gi))
    }

    async getPageItems(total, key, pageNumber, itemsPerPage, direction, filter) {

        //filter is like {key: 'type', value: 'admin'}
        let ordered
        if(filter) {
            const group = sublevel(this.rootDb, 'group_' + filter.key)
            const groupCollection = sublevel(group, filter.value)
            ordered = sublevel(groupCollection, 'list')
        } else {
            ordered = sublevel(this.rootDb, 'order_' + key)
        }

        const allItems = []
        const maxLength = String(total - 1).length;

        if (direction === 'desc') {
            const startFrom = String((total - (pageNumber * itemsPerPage))).padStart(maxLength, '0');
            const endAt = String((total - ((pageNumber + 1) * itemsPerPage))).padStart(maxLength, '0');
        
            for await (const [itemKey] of ordered.iterator({
                values: false,
                gte: endAt,       // greater than or equal to endAt
                lt: startFrom,    // less than startFrom
                limit: itemsPerPage,
                reverse: true
            })) {
                allItems.push(itemKey.split('_')[1]);
            }
        } else {
            const startFrom = String(pageNumber * itemsPerPage).padStart(maxLength, '0');
            for await (const [itemKey] of ordered.iterator({
                values: false,
                gt: startFrom,
                limit: itemsPerPage
            })) {
                allItems.push(itemKey.split('_')[1]);
            }
        }

        return await this.db.getMany(allItems)
    }

    async put(key: string, value: string, options?) {
        const { keyEncoding, valueEncoding, ...internalOptions } = options ?? {};
        if (this.batch) {
            if (this.batchCounter === this.batchLimit) {
                this.batchIndexes()
            } else {
                this.batchCounter++
                if (!this.batchTimer) {
                    this.batchTimer = setTimeout(() => {
                        this.batchIndexes()
                    }, this.batchTimeout);
                }
            }
        } else {
            await this.regenerateIndexes(value);
        }
        return await this.db.put(key, value, options)
    }

    private batchIndexes() {
        this.regenerateIndexes();
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
        this.batchCounter = 0;
    }

    async regenerateIndexes(value?) {
        return await ProtoLevelDB.regenerateIndexes(this.rootDb, this.db, this.location, value);
    }

    async getGroupIndexes() {
        try {
            const indexTable = sublevel(this.rootDb, 'indexTable')
            return JSON.parse(await indexTable.get('groupIndexes'))
        } catch (e) {
            logger.error({ db: this.location }, 'Error reading group indexes for database: ' + this.location)
        }

        return []
    }

    static async regenerateIndexes(rootDb, db, location, value?) {
        let indexData;
        let groupIndexData;
        try {
            const indexTable = sublevel(rootDb, 'indexTable')
            indexData = JSON.parse(await indexTable.get('indexes'))
            groupIndexData = JSON.parse(await indexTable.get('groupIndexes'))
        } catch (e) {
            logger.debug('Table has no indexes: ', location)
        }

        if ((indexData && indexData.keys.length) || groupIndexData && groupIndexData.length) {
            const indexes = indexData.keys
            let allItems = []

            for await (const [itemKey, itemValue] of db.iterator()) {
                allItems.push(JSON.parse(itemValue));
            }

            if (Array.isArray(value)) {
                value.forEach(newItemJson => {
                    const newItem = JSON.parse(newItemJson);
                    allItems = allItems.filter(listItem => listItem[indexData.primary] !== newItem[indexData.primary]);
                    allItems.push(newItem);
                });
            } else if (value) {
                const newItem = JSON.parse(value);
                allItems = allItems.filter(listItem => listItem[indexData.primary] !== newItem[indexData.primary]);
                allItems.push(newItem);
            }

            const counter = sublevel(rootDb, 'counter');
            await counter.put('total', JSON.stringify(allItems.length));

            if(groupIndexData && groupIndexData.length) {
                for (var i = 0; i < groupIndexData.length; i++) {
                    const currentIndex = groupIndexData[i];
                    const groupSubLevel = sublevel(rootDb, 'group_' + currentIndex.key);
                    // const grouped = sublevel(rootDb, 'group_' + currentIndex);
                    const groupItems = allItems.reduce((acc, item) => {
                        if(currentIndex.fn) {
                            //fn is a string with a small js like  "(data) => data.x > 10"
                            //TODO: use new function to evaluate the expression
                            const fn = new Function('data', currentIndex.fn);
                            const itemKeys = fn(item)
                            itemKeys.forEach(ckey => {
                                if (!acc[ckey]) {
                                    acc[ckey] = []
                                }
                                acc[ckey].push(item[indexData.primary])
                            })
                            return acc
                        } else {
                            if(!acc[item[currentIndex.key]]) {
                                acc[item[currentIndex.key]] = []
                            }
                            acc[item[currentIndex.key]].push(item[indexData.primary])
                        }
                    }, {})

                    //at this point, groupItems is an object like: { 'group1': [1,2,3], 'group2': [4,5,6] }
                    //where the numbers are the primary keys of the items that belong to that group
                    //we need to create a sublevel for each group, and store the items in the order they are in the group
                    //using batch

                    for (const groupKey of Object.keys(groupItems)) {
                        const subLevelGroupCollection = sublevel(groupSubLevel, groupKey);
                        await subLevelGroupCollection.clear();
                        
                        const list = sublevel(subLevelGroupCollection, 'list');
                        const total = sublevel(subLevelGroupCollection, 'counter');
                        total.put('total', JSON.stringify(groupItems[groupKey].length));
                        await list.clear();
                        await list.batch(groupItems[groupKey].map((item, i) => {
                            return String(i).padStart(String(groupItems[groupKey].length - 1).length, '0') + '_' + item
                        }).map(k => ({
                            type: 'put',
                            key: k,
                            value: ''
                        })));
                    }
                }
            }

            if(indexData && indexData.keys.length) {    
                const maxLength = String(allItems.length - 1).length;
                for (var i = 0; i < indexes.length; i++) {
                    const currentIndex = indexes[i];
                    const ordered = sublevel(rootDb, 'order_' + currentIndex);
                    await ordered.clear();
                    await ordered.batch(allItems.sort((a, b) => {
                        if (a[currentIndex] < b[currentIndex]) {
                            return -1;
                        }
                        if (a[currentIndex] > b[currentIndex]) {
                            return 1;
                        }
                        return 0;
                    }).map((item, i) => {
                        return String(i).padStart(maxLength, '0') + '_' + item[indexData.primary]
                    }).map(k => ({
                        type: 'put',
                        key: k,
                        value: ''
                    })));
                }
            }
        }
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
        } catch (e: any) {
            if (e.name == 'NotFoundError') {
                return false
            } else {
                throw e
            }
        }
    }

    static async initDB(dbPath: string, initialData = {}, options?) {
        const { indexes, groupIndexes, dbOptions, ...levelOptions } = options ?? {}
        optionsTable[dbPath] = dbOptions
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath);
        }

        const setupDatabase = async () => {
            logger.debug(`connecting to database: ${dbPath}`);
            const db = this.connect(dbPath);

            if (db.status !== 'open') {
                await new Promise((resolve, reject) => {
                    db.on('open', resolve);
                    db.on('error', reject);
                });
            }

            logger.debug(`connected to database on: ${dbPath}`);
            //check for database version, if it doesnt exists, assume v1
            if (!fs.existsSync(path.join(dbPath, 'version'))) {
                console.log('Converting from v1 to v2: Detected database version v1 for database: ', dbPath)
                for await (const [key, value] of db.rootDb.iterator()) {
                    if (!key.includes('!')) {
                        if (key != 'initialized') {
                            console.log('Moving item: ', key, 'from root level to values sublevel')
                            await db.put(key, value);
                            console.log('will store in sublevel: ', key, value)
                        }

                        await db.rootDb.del(key);
                    }
                }
                fs.writeFileSync(path.join(dbPath, 'version'), '2')
            }
            if (!fs.existsSync(path.join(dbPath, "initialized"))) {
                logger.info('database ' + dbPath + ' not initialized, loading initialData...');

                const keys = Object.keys(initialData);

                for (let key of keys) {
                    await db.put(key, JSON.stringify(initialData[key]));
                    logger.debug({ key: key, value: initialData[key] }, `Added: ${key} -> ${JSON.stringify(initialData[key])}`);
                }

                fs.writeFileSync(path.join(dbPath, "initialized"), JSON.stringify(initialData, null, 4));
            }
        }

        try {
            await setupDatabase();
        } catch (error) {
            logger.error({ error }, "Error initializing the database");
            throw error;
        }
        const rootDb = level(dbPath, levelOptions);
        const db = sublevel(rootDb, 'values')

        if (indexes || groupIndexes) {
            const indexTable = sublevel(rootDb, 'indexTable')
            if(indexes) await indexTable.put('indexes', JSON.stringify(indexes))
            if(groupIndexes) await indexTable.put('groupIndexes', JSON.stringify(groupIndexes))
            this.regenerateIndexes(rootDb, db, dbPath)
        }
    }

    static connect(location, options?, config?): ProtoLevelDB {
        options = options ? { valueEncoding: 'json', ...options } : { valueEncoding: 'json' }
        return super.connect(location, options, config)
    }

    static getInstance(location, options?, config?: ProtoDBConfig) {
        options = options ? { valueEncoding: 'json', ...options } : { valueEncoding: 'json' }
        return new ProtoLevelDB(location, options, config)
    }
}

const getDBPath = (dbPath) => {
    const [dbName, env] = dbPath.split('/').reverse()
    return '../../data/' + (env ? env + '/databases/' : 'databases/') + dbName
}

export const connectDB = (dbPath: string, initialData?: Object, options?) => {
    return ProtoLevelDB.initDB(getDBPath(dbPath), initialData, options)
}

export const getDB = (dbPath: string, req?, session?): ProtoDB => {
    return ProtoLevelDB.connect(getDBPath(dbPath))
}

export const leveldbProvider = {
    connectDB,
    getDB
}

export const closeDBS = async () => {
    const keys = Object.keys(dbHandlers)
    for (const key of keys) {
        await dbHandlers[key].close()
    }
}

export const getDBOptions = (modelType, dbOptions?) => {
    return {
        indexes: modelType.getIndexes(),
        groupIndexes: modelType.getGroupIndexes(),
        dbOptions: {
            batch: false,
            batchLimit: 100,
            batchTimeout: 5000,
            ...dbOptions
        }     
    }
}