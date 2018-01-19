import React from 'react';
import axios from 'axios';
import TotalAllocations from './TotalAllocations.jsx';
import CoinChartCard from './CoinChartCard.jsx';
import BuyOrdersCard from './BuyOrdersCard.jsx';
import SellOrdersCard from './SellOrdersCard.jsx';
import PastTradesCard from './PastTradesCard.jsx';
import BuyCard from './BuyCard.jsx';
import SellCard from './SellCard.jsx';
import MarketsCard from './MarketsCard.jsx';
import TopCryptoNews from './TopCryptoNews.jsx';
import ActivityFeed from './ActivityFeed.jsx';
import { Header, Input, Menu, Segment, Container, Divider, Grid, Sticky, Button, Icon, Image, Statistic } from 'semantic-ui-react';

class TradingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Markets',
      currentCoin: 'BTC/USD'
    };

    this.chartData = {
      labels: props.state.chartLabels,
      datasets: [{
        label: 'Price',
        data: props.state.chartDataSet,
        backgroundColor: props.state.chartBGcolor,
        borderColor: props.state.chartBorderColor
      }]
    };
    
    this.changeLayout = this.changeLayout.bind(this);
    this.handleExchangeBookClick = this.handleExchangeBookClick.bind(this);
  }

  componentDidMount() {
    this.load()
  }

  changeLayout (e) {
    console.log(e.target);
  }

  handleExchangeBookClick(name) {

    // console.log('setting currentcoin to', name)
    var instance = this;
    // console.log('IN BUY ORDERS CARD', this.props.currentCoin);
    var currentPair = name.split('/').join('');
    axios.get(`/buys/${currentPair}`).then((response) => {
      var buysResponse = response;
        axios.get(`/sells/${currentPair}`).then((response) => {
          // console.log('BUYS ARE', response);
          instance.setState((prevState) => {
            return {
              sellOrders: response.data.rows.slice(0, 50),
              buyOrders: buysResponse.data.rows.slice(0, 50),
              currentCoin: name
            }
          })
        }).catch((error) => {
          console.log(error);
        })
    }).catch((error) => {
      console.log(error);
    })

    axios.get(`/completedOrders/${currentPair}`).then((response) => {
      instance.setState({
        pastTrades: response.data.rows
      })
    }).catch((error) => {
      console.log(error);
    })
    
  
  }

  load() {
    var instance = this;
    var convertToNum = function(str) {
      var output = []; 
      // console.log(str);
      for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (char === '.') {
          output.push(char);
        } 
        else if (!isNaN(Number(char))) {
          output.push(char);
        }
      }
      return output.join('');
    }
 

    var currentCoin = instance.state.currentCoin;
    var currentPair = currentCoin.split('/').join('');

    axios.get(`/buys/${currentPair}`).then((response) => {
      var buysResponse = response;
        axios.get(`/sells/${currentPair}`).then((response) => {
          instance.setState((prevState) => {
            return {
              sellOrders: response.data.rows.slice(0, 50),
              buyOrders: buysResponse.data.rows.slice(0, 50),
              currentCoin: prevState.currentCoin
            }
          })
        }).catch((error) => {
          console.log(error);
        })
    }).catch((error) => {
      console.log(error);
    })

    axios.get(`/completedOrders/${currentPair}`).then((response) => {
      instance.setState({
        pastTrades: response.data.rows
      })
    }).catch((error) => {
      console.log(error);
    })

    axios.get('/user').then((response) => {
      var data = response.data.rows[0].row.split(',');
      var btcBal = convertToNum(data[0]);
      var ethBal = convertToNum(data[1]);
      var xrpBal = convertToNum(data[2]);
      var usdBal = convertToNum(data[3]);

      // console.log('setting USD Balances to', usdBal)
      instance.setState((prevState) => {
        return {
          usdBalance: usdBal,
          ethBalance: ethBal,
          xrpBalance: xrpBal,
          btcBalance: btcBal
        }
      })
    }).catch((error) => {
      console.log('error on get', error);
    })
  }

  handleBuyButtonClick(volume, price, type) {
    
    var instance = this;
    if (type === 'limit' || type === undefined) {
      // get the first order
      // console.log(this.state.sellOrders);
      var makeSale = function(usdBalance, orderVol, orderPrice, sellOrders) {
        if (usdBalance <= 0) {
          // base case
          return 'finished';
        } 
        // else go through order and complete
        var firstOrder = sellOrders[0];
        console.log('first order is', firstOrder);
        // if (Number(firstOrder.quantity) >= orderVol) {
          if (usdBalance > (orderVol * orderPrice)) {
            if (orderPrice >= Number(firstOrder.price)) {
            // if buyer has enough usd_balance to cover price
            // PATCH order to be executed T at the time
            // PATCH user to update usd_balance and coin balance
            // CREATE NEW order with remaining quantity
              axios.post('/orders', {orderId: firstOrder.id, quantity: orderVol, price: orderPrice}).then((response) => {
                console.log(response);
              }).catch((error) => {
                console.log(error);
              });

              var newQuantity = firstOrder.quantity - orderVol;
              if (newQuantity > 0) {
                  axios.post('/newOrder', {type: firstOrder.type, executed: false, quantity: newQuantity, price: firstOrder.price, currency: firstOrder.currency, pair: firstOrder.pair, time_executed: null, userid: firstOrder.userid}).then((response) => {
                    console.log(response);
                    instance.load();
                  }).catch((error) => {
                    console.log(error);
                  })
                
                // console.log('old balances are', usdBalance);
                var newUsdBalance = Number(usdBalance) - (Number(orderVol) * Number(orderPrice));
                // console.log('new balances are!!', newUsdBalance, orderVol, orderPrice)
                var newCoinBalance = Number(orderVol);
                var currentCoin = instance.state.currentCoin;
                currentCoin = currentCoin.split('/')[0];
                var updateBalance;
                if (currentCoin === 'BTC') {
                  updateBalance = instance.state.btcBalance;
                }
                if (currentCoin === 'ETH') {
                  updateBalance = instance.state.ethBalance;
                } 
                if (currentCoin === 'XRP') {
                  updateBalance = instance.state.xrpBalance;
                }
                // console.log(newCoinBalance, updateBalance)
                newCoinBalance = Number(newCoinBalance) + Number(updateBalance);
                axios.post('/userBalance', {newUsdBalance: newUsdBalance, newCoinBalance: newCoinBalance, coin: currentCoin}).then((response) => {
                  // console.log(response);
                  instance.load();
                }).catch((error) => {
                  console.log(error);
                });
              } else {
                var extraVol = Math.abs(newQuantity);
                var firstVol = firstOrder.quantity;
                console.log('bigger by', Math.abs(newQuantity));
              }
            } else  {
              // create a BUY order
              axios.post('/newUserOrder', {type: 'BUY', executed: false, quantity: orderVol, price: orderPrice, 
                currency: firstOrder.currency, pair: firstOrder.pair, time_executed: null}).then((response) => {
                  // console.log(response);
                  instance.load();
                }).catch((error) => {
                  console.log(error);
                })
              console.log('dont be cheap, your price is too low');
            }

          } else {
            console.log('Not enough $$$ in the bank to make this trade!')
          }
      }
      makeSale(Number(instance.state.usdBalance), Number(volume), Number(price), instance.state.sellOrders);
    } 

  }

  handleMarketBuyClick(usdVal) {
    var instance = this;
    var sellOrders = instance.state.sellOrders;
    var newCoins = 0;
    var executeBuy = function(usdVal, sellOrders) {  
      if (usdVal === 0) {
        console.log('out of money/order complete');
        return;
      } else { 
        var firstOrder = sellOrders[0];
        console.log(firstOrder);
        if (Number(firstOrder.quantity) * Number(firstOrder.price) >= usdVal) {
          // only need 1 order
          // execute buy on the first order
          var orderVol = (usdVal / Number(firstOrder.price));
          axios.post('/orders', {orderId: firstOrder.id, quantity: orderVol, price: firstOrder.price}).then((response) => {
            console.log(response);
          }).catch((error) => {
            console.log(error);
          });
          var newQuantity = firstOrder.quantity - orderVol;
          if (newQuantity > 0) {
          axios.post('/newOrder', {type: firstOrder.type, executed: false, quantity: newQuantity, price: firstOrder.price, currency: firstOrder.currency, pair: firstOrder.pair, time_executed: null, userid: firstOrder.userid}).then((response) => {
                    console.log(response);
                    instance.load();
                  }).catch((error) => {
                    console.log(error);
                  })
          }
          
          // console.log(newCoinBalance, updateBalance)
          var newCoinBalance = Number(orderVol);
          newCoins += newCoinBalance;
          
        } else {
          console.log('not enough to fill', usdVal - Number(firstOrder.quantity) * Number(firstOrder.price));
          var firstOrderBuy = Number(firstOrder.quantity) * Number(firstOrder.price);
          executeBuy(firstOrderBuy, [firstOrder]);
          var remainingOrder = usdVal - (Number(firstOrder.quantity) * Number(firstOrder.price));
          executeBuy(remainingOrder, sellOrders.slice(1, sellOrders.length));

          // first order doesn't have enough to fill
          // execute on first order
          // recurse with reduced usdVal, sellOrders = sellOrders.slice(0, sellOrders.length)
        }
      }
    }
    executeBuy(usdVal, sellOrders);
    var updateBalance;
    var currentCoin = instance.state.currentCoin;
    currentCoin = currentCoin.split('/')[0];
    var updateBalance;
    if (currentCoin === 'BTC') {
      updateBalance = instance.state.btcBalance;
    }
    if (currentCoin === 'ETH') {
      updateBalance = instance.state.ethBalance;
    } 
    if (currentCoin === 'XRP') {
      updateBalance = instance.state.xrpBalance;
    }
    var newCoinBalance = Number(updateBalance) + newCoins;
    axios.post('/userBalance', {newUsdBalance: instance.state.usdBalance - usdVal, newCoinBalance: newCoinBalance, coin: currentCoin}).then((response) => {
       // console.log(response);
          instance.load();
        }).catch((error) => {
            console.log(error);
        });
  }


  handleSellButtonClick(volume, price, type) {
    console.log(volume, price, type)
  }

  render() {

    return (
      <div className="ui segment pushable" id="portfolioPage">

        {/* ----- HTML Below Designates the Content Space (two cards wide) -----*/}
        <div className="pusher">
          <div className="ui segment">
            <h1 className="header centered"> {this.state.page} </h1>
            <CoinChartCard chartData={this.chartData} currentCoinData={this.props.state}/> 

            <div className="ui divider"></div> 
            <div className="ui two stackable cards centered">
              <BuyCard usdBalance  = {this.state.usdBalance} currentCoin = {this.state.currentCoin} clickFn = {this.handleBuyButtonClick.bind(this)} clickFn2 = {this.handleMarketBuyClick.bind(this)}/>
              <SellCard currentCoin = {this.state.currentCoin} btcBalance = {this.state.btcBalance} clickFn = {this.handleSellButtonClick.bind(this)} ethBalance = {this.state.ethBalance} xrpBalance = {this.state.xrpBalance}/>
            </div>  
            <div className="ui divider"></div> 
            <div className="ui two stackable cards centered">
              <MarketsCard clickFn = {this.handleExchangeBookClick.bind(this)} currentCoin = {this.state.currentCoin}/>
              <PastTradesCard currentCoin = {this.state.currentCoin} pastTrades = {this.state.pastTrades}/>
            </div>
            <div className="ui divider"></div> 
            <div className="ui two stackable cards centered">
              <BuyOrdersCard currentCoin = {this.state.currentCoin} orders = {this.state.buyOrders}/>
              <SellOrdersCard currentCoin = {this.state.currentCoin} orders = {this.state.sellOrders}/>
              {/* -------------- The Content Space HTML Ends here -------------------------*/}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default TradingPage;
