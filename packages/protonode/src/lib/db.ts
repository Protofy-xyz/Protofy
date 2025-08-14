import { pathToFileURL } from 'url';
import { ProtoSqliteDB } from './dbproviders/sqlite';

export type ProtoDBProvider = {
    initDB: (...args: any[]) => any | Promise<any>;
    connect: (...args: any[]) => any | Promise<any>;
    closeDBS: () => Promise<void>;
};

const providerRegistry = new Map<string, ProtoDBProvider>();

export function getDBProvider(): ProtoDBProvider {
    const providerName = process.env.DB_PROVIDER ?? "sqlite"
    const provider = providerRegistry.get(providerName);
    if (!provider) return ProtoSqliteDB
    return provider;
}

export const connectDB = (dbPath: string, initialData?: Object, options?) => {
    return getDBProvider().initDB(dbPath, initialData, options);
}

export const getDB = (dbPath: string, req?, session?) => {
    return getDBProvider().connect(dbPath);
}

export const closeDBS = async () => {
    return getDBProvider().closeDBS();
}

export const dbProvider = {
    connectDB,
    getDB,
    closeDBS
}

export const getDBOptions = (modelType, dbOptions?) => {
    return {
        indexes: modelType.getIndexes(),
        groupIndexes: modelType.getGroupIndexes(),
        dbOptions: {
            batch: false,
            batchLimit: 100,
            batchTimeout: 2000,
            ...dbOptions
        }
    }
}

export function registerDBProvider(name: string, provider: ProtoDBProvider): string {
    const key = String(name).toLowerCase();

    if (providerRegistry.has(key)) {
        console.error(`[db] Provider '${key}' is already registered`);
        return key;
    }

    providerRegistry.set(key, provider);
    console.log("[db] Provider registered:", key, provider);
    return key;
}