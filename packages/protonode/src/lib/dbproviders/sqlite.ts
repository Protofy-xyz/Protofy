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
  private db: Database.Database
  public capabilities: string[] = ['pagination', 'groupBySingle', 'groupByOptions']

  constructor(dbPath: string, options?: any, config?: ProtoDBConfig) {
    super(dbPath, options, config)
    this.db = new Database(dbPath, { fileMustExist: false, ...options })
    this.prepareSchema()
  }

  /** Crea las tablas si no existen */
  private prepareSchema() {
    this.db.exec(`
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

  static connect(dbPath: string, options?: any, config?: ProtoDBConfig) {
    return new ProtoSqliteDB(dbPath, options, config)
  }

  static getInstance(dbPath: string, options?: any, config?: ProtoDBConfig) {
    return new ProtoSqliteDB(dbPath, options, config)
  }

  /** Inicializa en disco y precarga initialData */
  static async initDB(dbPath: string, initialData = {}, options?: SQLiteOptions): Promise<void> {
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const db = new Database(dbPath, { fileMustExist: false })
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
    const row = this.db
      .prepare(`SELECT data FROM entries WHERE id = ?`)
      .get(key)
    if (!row) throw new Error('NotFound')
    return row.data
  }

  async exists(key: string) {
    const row = this.db
      .prepare(`SELECT 1 FROM entries WHERE id = ?`)
      .get(key)
    return !!row
  }

  async put(key: string, value: string, options?: any) {
    const now = Date.now()
    const existing = this.db
      .prepare(`SELECT created_at FROM entries WHERE id = ?`)
      .get(key)
    const created_at = existing ? existing.created_at : now

    this.db
      .prepare(
        `INSERT INTO entries(id,data,created_at)
         VALUES(@id,@data,@created_at)
         ON CONFLICT(id) DO UPDATE SET data=@data`
      )
      .run({ id: key, data: value, created_at })

    return true
  }

  async del(key: string) {
    this.db.prepare(`DELETE FROM entries WHERE id = ?`).run(key)
    return true
  }

  // — Conteos e índices —

  async count(filter?: { key: string; value: any }) {
    if (filter) {
      const sql = `
        SELECT COUNT(*) AS c FROM entries
        WHERE json_extract(data, ?) = ?
      `
      // utilizamos placeholder para la ruta JSON
      return this.db
        .prepare(sql)
        .get(`$.${filter.key}`, filter.value).c
    }
    return this.db.prepare(`SELECT COUNT(*) AS c FROM entries`).get().c
  }

  async getIndexedKeys() {
    try {
      const row = this.db
        .prepare(`SELECT value FROM indexTable WHERE name='indexes'`)
        .get()
      return JSON.parse(row.value).keys
    } catch {
      return []
    }
  }

  async getGroupIndexes() {
    try {
      const row = this.db
        .prepare(`SELECT value FROM indexTable WHERE name='groupIndexes'`)
        .get()
      return JSON.parse(row.value)
    } catch {
      return []
    }
  }

  async hasGroupIndexes(keys: string[]) {
    const gis = await this.getGroupIndexes()
    return keys.every(k => gis.some((gi: any) => gi.key === k))
  }

  async getGroupIndexOptions(groupKey: string, limit = 100) {
    const sql = `
      SELECT DISTINCT json_extract(data, ?) AS v
      FROM entries
      WHERE v IS NOT NULL
      LIMIT ?
    `
    // la ruta JSON va como parámetro
    return this.db
      .prepare(sql)
      .all(`$.${groupKey}`, limit)
      .map((r: any) => r.v)
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
    // validamos la dirección
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

    return this.db
      .prepare(sql)
      .all(...params)
      .map((r: any) => r.data)
  }

  // — Iterador para list() —

  *iterator() {
    const stmt = this.db.prepare(`SELECT id, data FROM entries`)
    for (const row of stmt.iterate()) {
      yield [row.id, row.data]
    }
  }

  async close() {
    this.db.close()
  }
}
