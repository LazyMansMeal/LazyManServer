const r = require('rethinkdb');
const CONFIG = require('../config');

class BaseDao {
  constructor() {
    this.connection = null;
    this.host = CONFIG.database.host;
    this.port = CONFIG.database.port;
    this.dbName = CONFIG.database.name;
  }

  connect = async () => {
    let conn = await r.connect({ host: this.host, port: this.port });
    this.connection = conn;
  }

  close = async () => {
    await this.connection.close();
  }

  insert = async (table, data) => {
    if (this.connection === null) throw new Error("No database connection established")
    let result = await r.db(this.dbName).table(table).insert(data).run(this.connection);
    return result;
  }

  getAll = async (table) => {
    if (this.connection === null) throw new Error("No database connection established")
    let cursor = await r.db(this.dbName).table(table).run(this.connection);
    let result = await cursor.toArray();
    return result;
  }

  get = async (table, predicate) => {
    if (this.connection === null) throw new Error("No database connection established")
    let cursor = await r.db(this.dbName).table(table).filter(predicate).run(this.connection);
    let result = await cursor.toArray();
    return result;
  }

  updateAll = async (table, data) => {
    if (this.connection === null) throw new Error("No database connection established")
    let cursor = await r.db(this.dbName).table(table).update(data).run(this.connection);
    let result = await cursor.toArray();
    return result;
  }
  
  update = async (table, predicate, data) => {
    if (this.connection === null) throw new Error("No database connection established")
    let result = await r.db(this.dbName).table(table).filter(predicate).update(data).run(this.connection);
    return result;
  }

  delete = async (table, predicate) => {
    if (this.connection === null) throw new Error("No database connection established")
    let result = await r.db(this.dbName).table(table).filter(predicate).delete().run(this.connection);
    return result;
  }
}

module.exports = BaseDao;