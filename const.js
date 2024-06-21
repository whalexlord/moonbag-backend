const Moralis = require('moralis').default;
require('dotenv').config();
const Database = require('./Database/database.js');

require('dotenv').config();

let dbConfig = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database,
  options: {
    encrypt: true, // For secure connection
    trustServerCertificate: true, // Change to false if not using a trusted certificate
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    charset: 'utf8mb4',
  },
};

const db = new Database(dbConfig);
db.connect();

const apiKey = process.env.MORALIS_API_KEY;

const config = {
  apiKey,
};

const runServer = async () => {
  console.log('Running moralis server');
  Moralis.start(config);
};

module.exports = {
  runServer,
  db,
};
