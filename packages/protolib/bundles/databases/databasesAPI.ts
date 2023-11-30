import { CreateApi } from 'protolib/api'
import * as fs from 'fs';
import * as path from 'path';
import * as fspath from 'path';
import { DatabaseEntryModel, DatabaseModel } from './databasesSchemas';
import { connectDB, getDB } from 'protolib/api'
import { getRoot } from '../../api';

const dbDir = (root) => fspath.join(root, "/data/databases/")

const customGetDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const databases = await getDatabases();
      for (const db of databases) {
        yield [db.name, JSON.stringify(db)];
      }
    },

    async put(key, value) {
      await connectDB(fspath.join(dbDir(getRoot(req)), fspath.basename(key)))
    },

    async *get(key) {
      const dbPath = fspath.join(dbDir(getRoot(req)), fspath.basename(key))
      const db = getDB(dbPath)
      yield* db.iterator()
    }
  };

  return db;
}

export const getDatabases = async () => {
  return (await fs.promises.readdir('../../' + path.join('data', 'databases'))).map((name) => {
    return {
      name: name
    }
  })
}

export const DatabasesAPI = CreateApi('databases', DatabaseModel, __dirname, '/adminapi/v1/', '', {}, () => { }, customGetDB, ['list', 'create', 'read'], false, {
  paginatedRead: {model: DatabaseEntryModel},
  requiresAdmin: ['*']
})

export default DatabasesAPI