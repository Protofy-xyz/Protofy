import { handler, AutoAPI, getRoot, closeDBS } from 'protonode'
import { connectDB, getDB } from '@my/config/dist/storageProviders';
import * as fs from 'fs'
import * as path from 'path'
import * as fspath from 'path'
import fse from 'fs-extra'
import { DatabaseEntryModel, DatabaseModel } from './databasesSchemas'

const dbDir = (req) => {
  return fspath.join(getRoot(req), "/data/databases/")
}

function getTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

async function moveFolder(src, dest) {
  try {
    const timestamp = getTimestamp()
    const destTime = `${dest}_${timestamp}`
    const parentDest = path.dirname(dest)
    await fs.promises.mkdir(parentDest, { recursive: true })
    await fs.promises.rename(src, destTime)
  } catch (error) {
    console.error('Error moving folder:', error)
    throw new Error(`Failed to move folder from ${src} to ${dest}: ${error.message}`)
  }
}

async function createBackupFolderIfNeeded(backupPath) {
  try {
    await fse.ensureDir(backupPath)
    return true
  } catch (error) {
    console.error("Failed to create backup folder:", error)
    return false
  }
}

const customGetDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const databases = await getDatabases()
      for (const db of databases) {
        yield [db.name, JSON.stringify(db)]
      }
    },

    async del(key, value) {
      const origin = fspath.join(dbDir(req), key)
      const dest = fspath.join(getRoot(req), 'data', 'deleted_databases', key)
      const deleteDatabase = async (retries=0) =>{
        try {
          await moveFolder(origin, dest)
        } catch (e) {
          if (retries < 3) {
            console.warn(`Failed to delete database ${key}, retrying... (${retries + 1})`)
            await new Promise(resolve => setTimeout(resolve, 1000)) // wait 1 second before retrying
            return deleteDatabase(retries + 1)
          } else {
            console.error(`Failed to delete database ${key} after multiple attempts:`, e)
            throw e
          }
        }
      }
      await deleteDatabase()
    },

    async put(key, value) {
      await connectDB(fspath.join(dbDir(req), fspath.basename(key)))
    },

    async *get(key) {
      const dbPath = fspath.join(dbDir(req), fspath.basename(key))
      const db = getDB(dbPath, req, session)
      yield* db.iterator()
    }
  }

  return db
}

export const getDatabases = async () => {
  const path = '../../' + fspath.join('data', 'databases')

  return (await fs.promises.readdir(path)).map((name) => {
    return {
      name: name
    }
  })
}

const EventAPI = AutoAPI({
  modelName: 'databases',
  modelType: DatabaseModel,
  prefix: '/api/core/v1/',
  dbName: '',
  requiresAdmin: ['*'],
  connectDB: () => new Promise(resolve => resolve(null)),
  getDB: customGetDB,
  operations: ['list', 'create', 'read', 'delete'],
  paginatedRead: { model: DatabaseEntryModel }
})

export default (app, context) => {
  EventAPI(app, context) //register basic crud

  app.post('/api/core/v1/backup/databases', handler(async (req, res, session) => {
    let ids = req.body
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }
    //TODO: Lock requests until backup complete to prevent a request flrom locking the database while the backup is in progress??
    await closeDBS()

    //create folder backup
    const backupFolderPath = fspath.join(getRoot(req), 'data', 'backups')
    if (!await createBackupFolderIfNeeded(backupFolderPath)) {
      res.status(500).send({ error: "Failed to create backup folder" })
      return
    }

    //global case
    if (ids.length === 1 && ids[0] === "*") {
      const allDbs = await getDatabases()
      const transformedArray = allDbs.map(element => element.name)
      ids = transformedArray
    }

    for (const id of ids) {
      try {
        const originalPath = path.join(dbDir(req), id)
        const backupPath = path.join(getRoot(req), "data", "backups", id + "_" + getTimestamp())

        if (!await createBackupFolderIfNeeded(backupPath)) {
          throw new Error("Failed to create backup folder")
        }

        await fse.copy(originalPath, backupPath, { recursive: true })
        console.log("Backup created for ", id)
      } catch (error) {
        console.error(`Failed to create backup for ${id}: ${error}`)
        res.status(500).send({ error: `Failed to create backup for ${id}` })
      }
    }
    res.send({ "result": "created" })
  }))
}

