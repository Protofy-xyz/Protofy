export type ProtoDBProvider = {
    initDB: (...args: any[]) => any | Promise<any>;
    connect: (...args: any[]) => any | Promise<any>;
    closeDBS: () => Promise<void>;
};

let provider: ProtoDBProvider;

export const connectDB = (dbPath: string, initialData?: Object, options?) => {
    return provider.initDB(dbPath, initialData, options);
}

export const getDB = (dbPath: string, req?, session?) => {
    return provider.connect(dbPath);
}

export const closeDBS = async () => {
    return provider.closeDBS();
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

export function registerDBProvider(providerToRegister: ProtoDBProvider): void {
    provider = providerToRegister;
}