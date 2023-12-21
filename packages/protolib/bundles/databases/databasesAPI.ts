import { CreateApi, handler } from 'protolib/api'
import * as fs from 'fs'
import * as path from 'path'
import * as fspath from 'path'
import fse from 'fs-extra'
import { DatabaseEntryModel, DatabaseModel } from './databasesSchemas'
import { connectDB, getDB, closeDBS } from 'protolib/api'
import { getRoot } from '../../api'

const dbDir = (root) => fspath.join(root, "/data/databases/")

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

    async put(key, value) {
      value = JSON.parse(value)
      if (value._deleted) {
        const origin = fspath.join(dbDir(getRoot(req)), key)
        const dest = fspath.join(getRoot(req), 'data', 'deleted_databases', key)
        moveFolder(origin, dest)
        return
      }
      await connectDB(fspath.join(dbDir(getRoot(req)), fspath.basename(key)))
    },

    async *get(key) {
      const dbPath = fspath.join(dbDir(getRoot(req)), fspath.basename(key))
      const db = getDB(dbPath)
      yield* db.iterator()
    }
  }

  return db
}

export const getDatabases = async () => {
  return (await fs.promises.readdir('../../' + path.join('data', 'databases'))).map((name) => {
    return {
      name: name
    }
  })
}

export const DatabasesAPI = (app, context) => {
  app.post('/adminapi/v1/backup/databases', handler(async (req, res, session) => {
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
      const allDbs =  await getDatabases()
      const transformedArray = allDbs.map(element => element.name)
      ids = transformedArray
    }

    for (const id of ids) {
      try {
        const originalPath = path.join(dbDir(getRoot(req)), id)
        const backupPath = path.join(getRoot(req), "data","backups", id + "_" + getTimestamp())

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

  CreateApi('databases', DatabaseModel, __dirname, '/adminapi/v1/', '', {}, () => { }, customGetDB, ['list', 'create', 'read', 'delete'], false, {
    paginatedRead: { model: DatabaseEntryModel },
    requiresAdmin: ['*']
  })(app, context)
}

export default DatabasesAPI