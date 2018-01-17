const { Pool, Client } = require('pg');
require('dotenv').config();

// FOR REAL LIFE HEROKU DEPLOYMENT
// const client = new Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   ssl: true
// });

// FOR LOCAL DATABASE TESTING
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'coinspace',
  password: 'password',
  ssl: false,
});

client.connect();

client.query(` CREATE TABLE IF NOT EXISTS users (
  id serial NOT NULL PRIMARY KEY,
  email varchar(50) NOT NULL,
  password text NOT NULL,
  btc_balance NUMERIC,
  eth_balance NUMERIC,
  xrp_balance NUMERIC,
  usd_balance NUMERIC
  )`);

client.query(`CREATE TABLE IF NOT EXISTS coin (
  id int NOT NULL PRIMARY KEY,
  name varchar(50) NOT NULL
)`);

client.query(`CREATE TABLE IF NOT EXISTS orders (

  id SERIAL NOT NULL PRIMARY KEY,
  type TEXT,
  executed BOOLEAN,
  quantity NUMERIC,
  price NUMERIC,
  currency VARCHAR(200),
  time_executed TIMESTAMP

)`)

let createSession = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
`

client.query(createSession);
const coins = ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple'];

coins.forEach((coin, index) => {
  client.query(`insert into coin (id, name) values (${index + 1}, '${coin}')`, (err, res) => {
    if (err) {
      console.log(`${coin} Insertion Error`, err);
    }
    console.log(`${coin} Insertion Success`);
  });
});

client.query(`CREATE TABLE IF NOT EXISTS price_history (
  id serial PRIMARY KEY,
  coin_id int NOT NULL,
  time_stamp varchar(50) NOT NULL,
  price decimal NOT NULL
)`);

client.query('alter table price_history add constraint id unique(coin_id, time_stamp)');

const data = [require('./BTCUSDHistoricalData.js'), require('./ETHUSDHistoricalData.js'), require('./LTCUSDHistoricalData.js'), require('./XRPUSDHistoricalData.js')];

data.forEach((history, index) => {
  history.forEach((dateObj) => {
    let date = dateObj.Date;
    let coinId = index + 1;
    let price = dateObj.Open;
    client.query(`insert into price_history (coin_id, time_stamp, price) values (${coinId}, '${date} 12', ${price})`, (err, res) => {
      if (err) {
        console.log('Insertion Error', err);
      }
      console.log(coinId, price, 'Daily Data Insertion Success');
    });
  });
});
