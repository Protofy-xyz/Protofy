import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { ProtoDB, ProtoDBConfig } from '../protodb'
import { getLogger } from 'protobase'

const logger = getLogger()

export interface SQLiteOptions {
  indexes?: { primary: string; keys: string[] }
  groupIndexes?: Array<{ key: string; fn?: string }>
  dbOptions?: any
}

export class ProtoSqliteDB extends ProtoDB {
  public capabilities: string[] = ['pagination', 'groupBySingle', 'groupByOptions']
  private path: string
  options: any
  constructor(dbPath: string, options?: any, config?: ProtoDBConfig) {
    super(dbPath, options, config)
    this.path = dbPath
    this.options = options
    const db = new Database(dbPath, { fileMustExist: false, ...options })
    this.prepareSchema(db)
    db.close()
  }

  static getDBPath(dbPath: string) {
    const [dbName, env] = dbPath.split('/').reverse()
    return '../../data/' + (env ? env + '/databases/' : 'databases/') + dbName
  }

  /** Crea las tablas si no existen */
  private prepareSchema(db: Database.Database) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id          TEXT PRIMARY KEY,
        data        TEXT NOT NULL,
        created_at  INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS indexTable (
        name  TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)
  }

  private withDB<T>(fn: (db: Database.Database) => T): T {
    const db = new Database(this.path, { fileMustExist: false, ...this.options })
    try {
      return fn(db)
    } finally {
      db.close()
    }
  }

  static connect(dbPath: string, options?: any, config?: ProtoDBConfig) {
    return new ProtoSqliteDB(this.getDBPath(dbPath), options, config)
  }

  static getInstance(dbPath: string, options?: any, config?: ProtoDBConfig) {
    return new ProtoSqliteDB(dbPath, options, config)
  }

  /** Inicializa en disco y precarga initialData */
  static async initDB(dbPath: string, initialData = {}, options?: SQLiteOptions): Promise<void> {

    const dir = path.dirname(this.getDBPath(dbPath))
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const db = new Database(this.getDBPath(dbPath), { fileMustExist: false })
    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id          TEXT PRIMARY KEY,
        data        TEXT NOT NULL,
        created_at  INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS indexTable (
        name  TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)

    if (options?.indexes) {
      db.prepare(
        `INSERT OR REPLACE INTO indexTable(name, value) VALUES('indexes', ?)`
      ).run(JSON.stringify(options.indexes))
    }
    if (options?.groupIndexes) {
      db.prepare(
        `INSERT OR REPLACE INTO indexTable(name, value) VALUES('groupIndexes', ?)`
      ).run(JSON.stringify(options.groupIndexes))
    }

    const now = Date.now()
    const insert = db.prepare(
      `INSERT OR IGNORE INTO entries(id, data, created_at) VALUES(?,?,?)`
    )
    for (const [id, obj] of Object.entries(initialData)) {
      insert.run(id, JSON.stringify(obj), now)
    }

    db.close()
  }

  // — CRUD básico —

  get(key: string) {
    return this.withDB(db => {
      const row = db.prepare(`SELECT data FROM entries WHERE id = ?`).get(key)
      if (!row) throw new Error('NotFound')
      return row.data
    })
  }

  async exists(key: string) {
    return this.withDB(db => {
      const row = db.prepare(`SELECT 1 FROM entries WHERE id = ?`).get(key)
      return !!row
    })
  }

  async put(key: string, value: string, options?: any) {
    return this.withDB(db => {
      const now = Date.now()
      const existing = db.prepare(`SELECT created_at FROM entries WHERE id = ?`).get(key)
      const created_at = existing ? existing.created_at : now

      db.prepare(`
        INSERT INTO entries(id,data,created_at)
        VALUES(@id,@data,@created_at)
        ON CONFLICT(id) DO UPDATE SET data=@data
      `).run({ id: key, data: value, created_at })

      return true
    })
  }

  async del(key: string) {
    return this.withDB(db => {
      db.prepare(`DELETE FROM entries WHERE id = ?`).run(key)
      return true
    })
  }

  // — Conteos e índices —

  async count(filter?: { key: string; value: any }) {
    return this.withDB(db => {
      if (filter) {
        const sql = `
          SELECT COUNT(*) AS c FROM entries
          WHERE json_extract(data, ?) = ?
        `
        return db.prepare(sql).get(`$.${filter.key}`, filter.value).c
      }
      return db.prepare(`SELECT COUNT(*) AS c FROM entries`).get().c
    })
  }

  async getIndexedKeys() {
    return this.withDB(db => {
      try {
        const row = db.prepare(`SELECT value FROM indexTable WHERE name='indexes'`).get()
        return JSON.parse(row.value).keys
      } catch {
        return []
      }
    })
  }

  async getGroupIndexes() {
    return this.withDB(db => {
      try {
        const row = db.prepare(`SELECT value FROM indexTable WHERE name='groupIndexes'`).get()
        return JSON.parse(row.value)
      } catch {
        return []
      }
    })
  }

  async hasGroupIndexes(keys: string[]) {
    const gis = await this.getGroupIndexes()
    return keys.every(k => gis.some((gi: any) => gi.key === k))
  }

  async getGroupIndexOptions(groupKey: string, limit = 100) {
    return this.withDB(db => {
      const sql = `
        SELECT DISTINCT json_extract(data, ?) AS v
        FROM entries
        WHERE v IS NOT NULL
        LIMIT ?
      `
      return db.prepare(sql).all(`$.${groupKey}`, limit).map((r: any) => r.v)
    })
  }

  // — Paginación ordenada —

  async getPageItems(
    total: number,
    key: string,
    pageNumber: number,
    itemsPerPage: number,
    direction: 'asc' | 'desc',
    filter?: { key: string; value: any }
  ) {
    return this.withDB(db => {
      const dir = direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

      let sql = `SELECT data FROM entries`
      const params: any[] = []

      if (filter) {
        sql += ` WHERE json_extract(data, ?) = ?`
        params.push(`$.${filter.key}`, filter.value)
      }

      sql += `
        ORDER BY json_extract(data, ?) ${dir}
        LIMIT ? OFFSET ?
      `
      params.push(`$.${key}`, itemsPerPage, pageNumber * itemsPerPage)

      return db.prepare(sql).all(...params).map((r: any) => r.data)
    })
  }

  // — Iterador para list() —

  * iterator() {
    const db = new Database(this.path, { fileMustExist: false, ...this.options })
    try {
      const stmt = db.prepare(`SELECT id, data FROM entries`)
      for (const row of stmt.iterate()) {
        yield [row.id, row.data]
      }
    } finally {
      db.close()
    }
  }

  async close() {
    // ya no hace falta cerrar nada, pero se mantiene para compatibilidad
  }
}
