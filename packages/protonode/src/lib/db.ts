import { ProtoSqliteDB }  from './dbproviders/sqlite';
import { ProtoDB } from './protodb';

const getDBPath = (dbPath) => {
    const [dbName, env] = dbPath.split('/').reverse()
    return '../../data/' + (env ? env + '/databases/' : 'databases/') + dbName
}

export const connectDB = (dbPath: string, initialData?: Object, options?) => {
    return ProtoSqliteDB.initDB(getDBPath(dbPath), initialData, options)
}

export const getDB = (dbPath: string, req?, session?) => {
    return ProtoSqliteDB.connect(getDBPath(dbPath))
}

export const closeDBS = async () => {
    return await ProtoSqliteDB.closeDBS()
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