const sql = require('mssql');

class Database {
  config = {};
  poolConnection = null;
  connected = false;

  constructor(_config) {
    this.config = _config;
  }

  async connect() {
    if (this.connected == false) {
      this.poolConnection = await sql.connect(this.config);
      this.connected = true;
      console.log('DB connected!');
      await this.initTables();
    } else {
      console.log('DB already connected');
    }
  }

  async initTables() {
    if (this.connected) {
      console.log('initalizating...');
      try {
        await this.poolConnection.request().query(`
                         IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='record_sol' and xtype='U')
                         CREATE TABLE record_sol(
                              id INT IDENTITY(1,1) PRIMARY KEY,
                              wallet_address NVARCHAR(270) NOT NULL,
                              asset NVARCHAR(270),
                              amount NVARCHAR(270),
                              burn NVARCHAR(270),
                              subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         )
                    `);

        await this.poolConnection.request().query(`
                        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='record_eth' and xtype='U')
                        CREATE TABLE record_eth(
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            wallet_address NVARCHAR(270) NOT NULL,
                            asset NVARCHAR(270),
                            amount NVARCHAR(270),
                            burn Bit DEFAULT 0,
                            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        )
                    `);

        console.log('Tables initialized successfully.');
      } catch (error) {}
    } else {
      console.log('DB not connected');
    }
  }

  async all(query, callback) {
    try {
      const res = await this.poolConnection.request().query(query);
      callback(null, res);
    } catch (err) {
      callback(err, null);
    }
  }
  async run(query, callback = null) {
    try {
      const res = await this.poolConnection.request().query(query);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}
module.exports = Database;
