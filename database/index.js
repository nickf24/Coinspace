const { Pool, Client } = require('pg');
require('dotenv').config();
const authentication = require('../server/authentication.js');

// // FOR HEROKU DEPLOYMENT
// const pool = new Pool({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.DB_PORT,
//   ssl: true,
// });

// FOR LOCAL DATABASE TESTING
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'coinspace',
  password: 'password',
  port: 5432,
  ssl: false,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Pool Connection Error', err);
  }
  console.log('Pool Connected');
});

// // FOR HEROKU DEPLOYMENT
// const client = new Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.DB_PORT,
//   ssl: true,
// });

// FOR LOCAL DATABASE TESTING
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'coinspace',
  password: 'password',
  port: 5432,
  ssl: false,
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Client Connection Error', err);
  }
  console.log('Client Connected');
});

var getData = () => {
  return new Promise((resolve, reject) => {
    client.query(
      `select a.name, b.coin_id, b.price, to_timestamp(time_stamp, 'mm/dd/yy HH24') as date
      from coin a
      inner join price_history b on a.id = b.coin_id order by b.id`, (err, res) => {
        if (err) {
          console.log('History err', err);
          reject(err);
        }
        console.log('Query success');
        resolve(res.rows);
      }
    );
  });
};

// var insertNewUser = (username, hashedPassword) => {
//   return new Promise(function(resolve, reject) {
//     client.query(
//       `insert into users (email, password, usd_balance) values ('${username}', '${hashedPassword}', 100000)`, (err, res) => {
//         if (err) {
//           return reject(err);
//         }
//         return resolve(res.rows);
//       });
//   });
// };

var insertNewUser = (req, callback) => {
  authentication.validateEntry(req, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      authentication.hashPassword(req.body.password, (error, hash) => {
        if (error) {
          callback(error, null);
        } else {
          var params = [req.body.username, hash];
          var queryStr = 'INSERT INTO users (username, password, btc_balance, eth_balance, xrp_balance, usd_balance) \
                            VALUES ($1, $2, 0, 0, 0, 100000) RETURNING id'
          client.query(queryStr, params, (error, result, fields) => {
            if (error) {
              var err = error;
              if (err.code === '23505') {
                var err = ['Username already err'];
              }
              callback(err, null);
            } else {
              callback(null, result.rows[0].id);
            }
          })
        }
      })
    }
  })
}

// var err = () => {
//   client.query(
//     return err, nullnew Promise(function(resolve, reject) {;
//         if (err) { else {
//           callback(null, result.rows[0].id);
//         }
//           return reject(err);
//         }
//         return resolve(res.rows);
//       });
//   });
// };

let findUser = (username, callback) => {
  var queryStr = "SELECT id, password FROM users WHERE users.username=$1";

  client.query(queryStr, [username], (error, result, fields) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  })
}

let getUserData = (userid, callback) => {
  console.log('finding user by id: ', userid);
  let queryStr = `SELECT id, username, btc_balance, eth_balance, xrp_balance, usd_balance FROM users \
                    WHERE users.id=${userid}`

  client.query(queryStr, (error, result, fields) => {    
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  })
}

var getBalancesOfUser = function(id, callback) {
  let queryStr = `SELECT (btc_balance, eth_balance, xrp_balance, usd_balance) FROM users WHERE id = '${id}'`;
  client.query(queryStr, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res)
    }
  })
}

var getBuyOrders = function(pair, callback) {
  let queryStr = `SELECT * FROM orders WHERE type = 'BUY' AND executed = 'false' AND pair = '${pair}' ORDER BY PRICE DESC`;
  console.log(queryStr);
  client.query(queryStr, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

var getSellOrders = function(pair, callback) {
  let queryStr = `SELECT * FROM orders WHERE type = 'SELL' AND executed = 'false' AND pair = '${pair}' ORDER BY PRICE` ;
  client.query(queryStr, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

let updateUserBalance = function(userId, coin, newCoinBalance, newUsdBalance, callback) {
  console.log('IN DATABASE', userId, coin, newCoinBalance, newUsdBalance);
  var updateBalance;
  if (coin === 'BTC') {
    updateBalance = 'btc_balance';
  }
  if (coin === 'ETH') {
    updateBalance = 'eth_balance';
  } 
  if (coin === 'XRP') {
    updateBalance = 'xrp_balance';
  }
  let queryStr = `UPDATE users SET (${updateBalance}, usd_balance) = (${newCoinBalance}, ${newUsdBalance}) WHERE id = ${userId}`;
  console.log('QUERYSTR IS', queryStr);
  client.query(queryStr, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

module.exports = {
  client,
  pool,
  getData,
  insertNewUser,
  getBalancesOfUser,
  findUser,
  getUserData,
  getBuyOrders,
  getSellOrders,
  updateUserBalance
};
