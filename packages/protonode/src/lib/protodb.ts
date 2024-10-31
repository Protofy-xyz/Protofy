import { getLogger } from 'protobase';
const logger = getLogger()
const dbHandlers: any = {}

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

    static async closeDBS() {
        const keys = Object.keys(dbHandlers)
        for (const key of keys) {
            await dbHandlers[key].close()
        }
    }

    static async initDB(dbPath: string, initialData = {}, options?) {
        throw new Error('Static method initDB must be implemented');
    }
}