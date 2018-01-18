const finex = require('../BitFinexAPI/BitFinexAPI.js');

let randomNumber = function(min, max) {
  var number = Math.round((max-min) * Math.random())
  return number
}

let orderType = function() {
  let possibleTypes = ['BUY', 'SELL'];
  var index = randomNumber(0, 1);
  return possibleTypes[index];
}

let quantity = function() {
  return randomNumber(1, 300);
}

var randomPrice = function(min, max) {
  var number = min + (max-min) * Math.random()
  return Number(number.toFixed(3));
}
class Order {
  constructor(coin, coinPrice) {

    this.executed = false;
    this.quantity = quantity();
    this.price = randomPrice(coinPrice * 0.95, coinPrice * 1.05);
    this.currency = 'USD';
    this.pair = `${coin}USD`;
    this.time_executed = null;

  }
}

module.exports.Generator = function(array, coinPrice) {
  // var results = finex.BitfinexAPI();
  const data = [require('./Initalize_database_data/BTCUSDHistoricalData.js'), require('./Initalize_database_data/ETHUSDHistoricalData.js'), require('./Initalize_database_data/XRPUSDHistoricalData.js')];
  var bitcoinPrice = data[0][379].Price;
  var ethPrice = data[1][379].Price;
  var xrpPrice = data[2][379].Price;
  console.log(xrpPrice)

  for (var i = 0; i <= 1000; i++) {
    var coins = ['ETH', 'BTC', 'XRP'];
    var coin = coins[Math.floor(Math.random() * 3)];
    if (coin === 'BTC') {
      coinPrice = bitcoinPrice;
    }
    if (coin === 'ETH') {
      coinPrice = ethPrice;
    }
    if (coin === 'XRP') {
      coinPrice = xrpPrice;
    }

  	var newOrder = new Order(coin, coinPrice);
    if (newOrder.price < coinPrice) {
      newOrder.type = 'BUY';
    } else {
      newOrder.type = 'SELL';
    }

  	array.push(newOrder);
  }
}