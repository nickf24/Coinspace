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

let randomPrice = function(min, max) {
  var number = Math.round(min + (max-min) * Math.random())
  return number
}
class Order {
  constructor(coin, coinPrice) {

    this.type = orderType();
    this.executed = false;
    this.quantity = quantity();
    this.price = randomPrice(coinPrice * 0.95, coinPrice * 1.05);
    this.currency = 'USD';
    this.pair = `${coin}/USD`;
    this.time_executed = null;

  }
}

module.exports.Generator = function(array, coin, coinPrice) {
  for (var i = 0; i <= 1000; i++) {
    var coins = ['ETH', 'BTC', 'XRP'];
    var coin = coins[Math.floor(Math.random() * 3)];
  	var newOrder = new Order(coin, coinPrice);
  	array.push(newOrder);
  }
}