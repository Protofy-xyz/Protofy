import { getLogger } from 'protobase';
import path from 'path'
import fs from 'fs'
import { ProtoDB, ProtoDBConfig } from '../protodb';

const level = require('level-party')
const sublevel = require('subleveldown')

const logger = getLogger()
const dbHandlers: any = {}

const optionsTable = {}

const FIXED_PADDING_LENGTH = 20;

export class ProtoLevelDB extends ProtoDB {
    private rootDb
    private db
    private batchCounter
    private batchTimer
    private batchLimit
    private batchTimeout
    private orderedInsert
    private batch
    private regeneratingIndexes
    private tableVersion: "a" | "b"
    private pendingIndex

    constructor(location, options?, config?: ProtoDBConfig) {
        super(location, options, config);
        this.capabilities = ['pagination', 'groupBySingle', 'groupByOptions']
        this.rootDb = level(location, options);
        this.db = sublevel(this.rootDb, 'values')
        const dbOptions = optionsTable[location] ?? {}
        this.batch = dbOptions.batch ?? false
        this.batchLimit = dbOptions.batchLimit ?? 5
        this.batchTimeout = dbOptions.batchTimeout ?? 10000
        this.orderedInsert = dbOptions.orderedInsert ?? false
        this.batchCounter = 0
        this.batchTimer = null
        this.regeneratingIndexes = false //flag to activate while regenerating indexes
        this.tableVersion = 'a'
        this.pendingIndex = false //flag to activate when an index is pending generation, because the generation
                                 //was skipper of an already regenerating indexes
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

    async del(key: string, options?) {
        const result = await this.db.del(key, options)
        await this.regenerateIndexes()
        return result
    }

    async count(filter?) {
        try {
            if (filter) {
                const groupDb = sublevel(this.rootDb, 'group_' + filter.key + '_' + this.tableVersion)
                const groupCollection = sublevel(groupDb, filter.value)
                const counter = sublevel(groupCollection, 'counter')
                return await counter.get('total')
            }
            const counter = sublevel(this.rootDb, 'counter_' + this.tableVersion)
            return await counter.get('total')
        }
        catch(e){
            if(e?.message === "Key not found in database [total]") { 
                return 0; 
            }
            throw e;
        }
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
        let ordered
        if (filter) {
            const group = sublevel(this.rootDb, 'group_' + filter.key + '_' + this.tableVersion)
            const groupCollection = sublevel(group, filter.value)
            ordered = sublevel(groupCollection, 'list')
        } else {
            ordered = sublevel(this.rootDb, 'order_' + key + '_' + this.tableVersion)
        }

        const allItems = []
        // Se utiliza la longitud fija para el padding
        const fixedLength = FIXED_PADDING_LENGTH;

        if (direction === 'desc') {
            const startFrom = String(total - (pageNumber * itemsPerPage)).padStart(fixedLength, '0');
            const endAt = String(total - ((pageNumber + 1) * itemsPerPage)).padStart(fixedLength, '0');

            for await (const [itemKey] of ordered.iterator({
                values: false,
                gte: endAt,       // greater than or equal to endAt
                lt: startFrom,    // less than startFrom
                limit: itemsPerPage,
                reverse: true
            })) {
                allItems.push(itemKey.split('_').slice(1).join('_'));
            }
        } else {
            const startFrom = String(pageNumber * itemsPerPage).padStart(fixedLength, '0');
            for await (const [itemKey] of ordered.iterator({
                values: false,
                gt: startFrom,
                limit: itemsPerPage
            })) {
                allItems.push(itemKey.split('_').slice(1).join('_'));
            }
        }
        return await this.db.getMany(allItems)
    }

    async put(key: string, value: string, options?) {
        const { keyEncoding, valueEncoding, ...internalOptions } = options ?? {};
        const result = await this.db.put(key, value, options)
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
            if (this.orderedInsert) {
                await ProtoLevelDB.appendToIndexes(this.rootDb, this.db, this.location, this.tableVersion, JSON.parse(value))
            } else {
                await this.regenerateIndexes();
            }
        }
        return result
    }

    private batchIndexes() {
        this.regenerateIndexes();
        clearTimeout(this.batchTimer);
        this.batchTimer = null; //allows to create a new timer
        this.batchCounter = 0;
    }

    async regenerateIndexes() {
        if (this.regeneratingIndexes) {
            this.pendingIndex = true
            return
        }
        this.regeneratingIndexes = true

        const id = Math.random().toString(36).substring(7);
        try {
            const nextTableVersion = this.tableVersion == 'a' ? 'b' : 'a'
            await ProtoLevelDB.regenerateIndexes(this.rootDb, this.db, this.location, nextTableVersion);
            this.tableVersion = nextTableVersion
        } catch (e) {
            logger.error({ db: this.location }, 'Error regenerating indexes for database: ' + this.location)
            this.regeneratingIndexes = false
        }
        this.regeneratingIndexes = false

        if (this.pendingIndex) {
            this.pendingIndex = false
            logger.info({ db: this.location }, 'Regenerate indexes: run because of pending index generation for database: ' + this.location)
            setTimeout(() => this.regenerateIndexes(), 1)
        }
    }

    async getGroupIndexes() {
        try {
            const indexTable = sublevel(this.rootDb, 'indexTable')
            return JSON.parse(await indexTable.get('groupIndexes'))
        } catch (e) {
        }
        return []
    }

    //given a groupkey, like 'city', return all possible values for that group
    async getGroupIndexOptions(groupKey, limit = 100) {
        try {
            const indexTable = sublevel(this.rootDb, 'indexTable')
            const groupIndexes = JSON.parse(await indexTable.get('groupIndexes'))
            const index = groupIndexes.find(gi => gi.key == groupKey)
            if (index) {
                const groupSubLevelOptions = sublevel(this.rootDb, 'group_' + index.key + '_options_' + this.tableVersion)
                const keys = []
                for await (const [key] of groupSubLevelOptions.iterator({ limit })) {
                    keys.push(key.split('_').slice(1).join('_'))
                }
                return keys
            } else {
                return []
            }
        } catch (e) {
        }
    }

    static async appendToIndexes(rootDb, db, location, tableVersion, value) {
        let indexData;
        let groupIndexData;
        try {
            const indexTable = sublevel(rootDb, 'indexTable')
            indexData = JSON.parse(await indexTable.get('indexes'))
            groupIndexData = JSON.parse(await indexTable.get('groupIndexes'))
        } catch (e) {
            logger.debug('Table has no indexes: ', location)
            return
        }

        // Increase both counters, the item is already inserted
        const total = await ProtoLevelDB.incrementKey(sublevel(rootDb, 'counter_' + tableVersion), 'total')

        if ((indexData && indexData.keys.length) || (groupIndexData && groupIndexData.length)) {
            const indexes = indexData.keys
            // Append to group indexes if present
            if (groupIndexData && groupIndexData.length) {
                const acc = {}
                for (var i = 0; i < groupIndexData.length; i++) {
                    const currentIndex = groupIndexData[i];
                    const groupSubLevel = sublevel(rootDb, 'group_' + currentIndex.key + '_' + tableVersion);
                    const groupSubLevelOptions = sublevel(rootDb, 'group_' + currentIndex.key + '_options_' + tableVersion)

                    if (currentIndex.fn) {
                        const fn = new Function('data', currentIndex.fn);
                        const itemKeys = fn(value)
                        for (const ckey of itemKeys) {
                            acc[ckey] = value[indexData.primary];
                        }
                    } else {
                        acc[value[currentIndex.key]] = value[indexData.primary]
                    }
                    const objKeys = Object.keys(acc)
                    for (const groupKey of objKeys) {
                        // Conserva el id original (groupKey.length) y lo paddea a longitud fija
                        groupSubLevelOptions.put(String(groupKey.length).padStart(FIXED_PADDING_LENGTH, '0') + '_' + groupKey, '')
                        const subLevelGroupCollection = sublevel(groupSubLevel, groupKey);
                        const list = sublevel(subLevelGroupCollection, 'list');
                        await ProtoLevelDB.incrementKey(sublevel(subLevelGroupCollection, 'counter'), 'total')
                        const item = acc[groupKey];
                        let found = false
                        for await (const [itemKey] of list.iterator({
                            values: false,
                            limit: 1,
                            reverse: true
                        })) {
                            found = true
                            const lastIndex = itemKey.split('_')[0]
                            const key = `${String(parseInt(lastIndex) + 1).padStart(FIXED_PADDING_LENGTH, '0')}_${item}`;
                            await list.put(key, '')
                        }
                        if (!found) {
                            await list.put(String(0).padStart(FIXED_PADDING_LENGTH, '0') + '_' + item, '')
                        }
                    }
                }
            }

            if (indexData && indexData.keys.length) {
                const paddedIndex = String(total - 1).padStart(FIXED_PADDING_LENGTH, '0');
                for (let i = 0; i < indexes.length; i++) {
                    const currentIndex = indexes[i];
                    const ordered = sublevel(rootDb, 'order_' + currentIndex + '_' + tableVersion);
                    const key = `${paddedIndex}_${value[indexData.primary]}`;
                    await ordered.put(key, '')
                }
            }
        }
    }
    
    static async regenerateIndexes(rootDb, db, location, tableVersion) {
        let indexData;
        let groupIndexData;
        try {
            const indexTable = sublevel(rootDb, 'indexTable')
            indexData = JSON.parse(await indexTable.get('indexes'))
            groupIndexData = JSON.parse(await indexTable.get('groupIndexes'))
        } catch (e) {
            logger.debug('Table has no indexes: ', location)
        }

        if ((indexData && indexData.keys.length) || (groupIndexData && groupIndexData.length)) {
            const indexes = indexData.keys
            let allItems = []

            for await (const [itemKey, itemValue] of db.iterator()) {
                allItems.push(JSON.parse(itemValue));
            }

            const counter = sublevel(rootDb, 'counter_' + tableVersion);
            await counter.put('total', JSON.stringify(allItems.length));

            if (groupIndexData && groupIndexData.length) {
                for (var i = 0; i < groupIndexData.length; i++) {
                    const currentIndex = groupIndexData[i];
                    const groupSubLevel = sublevel(rootDb, 'group_' + currentIndex.key + '_' + tableVersion);
                    const groupSubLevelOptions = sublevel(rootDb, 'group_' + currentIndex.key + '_options_' + tableVersion)
                    const groupItems = allItems.reduce((acc, item) => {
                        if (currentIndex.fn) {
                            const fn = new Function('data', currentIndex.fn);
                            const itemKeys = fn(item)
                            for (const ckey of itemKeys) {
                                if (!acc[ckey]) {
                                    acc[ckey] = [];
                                }
                                acc[ckey].push(item[indexData.primary]);
                            }
                            return acc
                        } else {
                            if (!acc[item[currentIndex.key]]) {
                                acc[item[currentIndex.key]] = []
                            }
                            acc[item[currentIndex.key]].push(item[indexData.primary])
                            return acc
                        }
                    }, {})

                    const objKeys = Object.keys(groupItems)
                    await groupSubLevelOptions.clear();

                    for (const groupKey of objKeys) {
                        // Se conserva el id original (groupKey.length) y se paddea a longitud fija
                        groupSubLevelOptions.put(String(groupKey.length).padStart(FIXED_PADDING_LENGTH, '0') + '_' + groupKey, '')
                        const subLevelGroupCollection = sublevel(groupSubLevel, groupKey);
                        const list = sublevel(subLevelGroupCollection, 'list');
                        const totalGroup = sublevel(subLevelGroupCollection, 'counter');
                        totalGroup.put('total', JSON.stringify(groupItems[groupKey].length));

                        const items = groupItems[groupKey];
                        const batchArray = [];
                        for (let i = 0; i < items.length; i++) {
                            const paddedIndex = String(i).padStart(FIXED_PADDING_LENGTH, '0');
                            const key = `${paddedIndex}_${items[i]}`;
                            batchArray.push({
                                type: 'put',
                                key: key,
                                value: ''
                            });
                        }
                        await list.clear();
                        await list.batch(batchArray);
                    }
                }
            }

            if (indexData && indexData.keys.length) {
                for (let i = 0; i < indexes.length; i++) {
                    const currentIndex = indexes[i];
                    const ordered = sublevel(rootDb, 'order_' + currentIndex + '_' + tableVersion);

                    // Sort items based on the current index
                    let sortedItems = allItems;
                    sortedItems.sort((a, b) => {
                        if (a[currentIndex] < b[currentIndex]) {
                            return -1;
                        }
                        if (a[currentIndex] > b[currentIndex]) {
                            return 1;
                        }
                        return 0;
                    });

                    // Create batch array using padding de longitud fija
                    let batchArray = [];
                    for (let j = 0; j < sortedItems.length; j++) {
                        const paddedIndex = String(j).padStart(FIXED_PADDING_LENGTH, '0');
                        const key = `${paddedIndex}_${sortedItems[j][indexData.primary]}`;
                        batchArray.push({
                            type: 'put',
                            key: key,
                            value: ''
                        });
                    }

                    await ordered.clear();
                    await ordered.batch(batchArray);
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
            if (indexes) await indexTable.put('indexes', JSON.stringify(indexes))
            if (groupIndexes) await indexTable.put('groupIndexes', JSON.stringify(groupIndexes))
            this.regenerateIndexes(rootDb, db, dbPath, 'a')
            this.regenerateIndexes(rootDb, db, dbPath, 'b')
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

    static async incrementKey(db, key) {
        let lockKey = `${key}-lock`;
        while (true) {
            try {
                await db.put(lockKey, 'locked', { sync: true });
                let value = await db.get(key).catch(err => {
                    if (err.notFound) return 0;
                    throw err;
                });
                let newValue = parseInt(JSON.parse(value), 10) + 1;
                await db.put(key, JSON.stringify(newValue), { sync: true });
                await db.del(lockKey, { sync: true });
                return newValue;
            } catch (err) {
                if (err.type === 'WriteError' && err.message.includes('Lock')) {
                    console.log('Lock error, retrying...')
                    await new Promise(resolve => setTimeout(resolve, 50));
                } else {
                    await db.del(lockKey, { sync: true }).catch(() => { });
                    throw err;
                }
            } finally {
                await db.del(lockKey, { sync: true }).catch(() => { });
            }
        }
    }
}