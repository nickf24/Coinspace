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
    var instance = this;
    var convertToNum = function(str) {
      var output = []; 
      for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (!isNaN(Number(char))) {
          output.push(char);
        }
      }
      return output.join('');
    }

    this.load()
    
    // console.log('IN BUY ORDERS CARD', this.props.currentCoin);
    var currentPair = this.state.currentCoin.split('/').join('');
    axios.get(`/buys/${currentPair}`).then((response) => {
      var buysResponse = response;
        axios.get(`/sells/${currentPair}`).then((resp) => {
          // console.log('BUYS ARE', response);
          instance.setState({
            sellOrders: resp.data.rows.slice(0, 50),
            buyOrders: buysResponse.data.rows.slice(0, 50)
          })
        }).catch((error) => {
          console.log(error);
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


  changeLayout (e) {
    console.log(e.target);
  }

  handleExchangeBookClick(name) {
    // alert('hey')
    console.log('setting currentcoin to', name)
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

    
  
  }

  load() {
    var instance = this;
    var convertToNum = function(str) {
      var output = []; 
      for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (!isNaN(Number(char))) {
          output.push(char);
        }
      }
      return output.join('');
    }
 

    var currentCoin = instance.state.currentCoin;
    // currentCoin = currentCoin.split('/')[0];
    var currentPair = currentCoin.split('/').join('');
    console.log('currentpair is', currentPair)

    axios.get(`/buys/${currentPair}`).then((response) => {
      var buysResponse = response;
        axios.get(`/sells/${currentPair}`).then((response) => {
          // console.log('BUYS ARE', response);
          instance.setState((prevState) => {
            console.log('SETTING STATE TO', prevState.currentCoin)
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

    axios.get('/completedOrders').then((response) => {
      console.log('completed orders are', response.data.rows)
      instance.setState({
        pastTrades: response.data.rows
      })
    })
  }

  handleBuyButtonClick(volume, price, type) {
    // console.log('HERE')
    console.log(volume, price, type, this.state.usdBalance, this.state.btcBalance);

    // execute the order
    // if market order
    var instance = this;
    if (type === 'limit' || type === undefined) {
      // get the first order
      console.log(this.state.sellOrders);
      var makeSale = function(usdBalance, orderVol, orderPrice, sellOrders) {
        if (usdBalance <= 0) {
          // base case
          return;
        } 
        // else go through order and complete
        var firstOrder = sellOrders[0];
        console.log('first order is', firstOrder);
        if (Number(firstOrder.quantity) >= orderVol) {
          if (instance.state.usdBalance > (orderVol * orderPrice)) {
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
              if (newQuantity !== 0) {
                axios.post('/newOrder', {type: firstOrder.type, executed: false, quantity: newQuantity, price: firstOrder.price, currency: firstOrder.currency, pair: firstOrder.pair, time_executed: null, userid: firstOrder.userid}).then((response) => {
                  console.log(response);
                  instance.load();
                }).catch((error) => {
                  console.log(error);
                })
              } 

              var newUsdBalance = Number(instance.state.usdBalance) - Number(orderVol) * Number(orderPrice);
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
              
              newCoinBalance = Number(newCoinBalance) + Number(updateBalance);
              axios.post('/userBalance', {newUsdBalance: newUsdBalance, newCoinBalance: newCoinBalance, coin: currentCoin}).then((response) => {
                console.log(response);
                instance.load();
              }).catch((error) => {
                console.log(error);
              });
            } else  {
              // create a BUY order
              axios.post('/newUserOrder', {type: 'BUY', executed: false, quantity: orderVol, price: orderPrice, 
                currency: firstOrder.currency, pair: firstOrder.pair, time_executed: null}).then((response) => {
                  console.log(response);
                  instance.load();
                }).catch((error) => {
                  console.log(error);
                })
              console.log('dont be cheap, your price is too low');
            }

          } else {
            console.log('Not enough $$$ in the bank to make this trade!')
          }
        } else {
          // first order does not have enough vol to cover
          // go through and buy up all of first over
          // make sales with rest of sell orders/remaining balance
          // makeSale(usdBalance) 
          console.log('first order does not enough vol to cover')
        }
      }
      makeSale(this.state.usdBalance, volume, price, this.state.sellOrders);
      // if first order volume > purchase volume 
        // else 
          // send message 'cannot buy this many coins'
      // else if purchase volume > first order volume
        // var sum = 0;
        // var usd_balance = current user's usd_balance
        

    } else {
      // if limit order
      // if limit order price < highest current bid
        // buy as much up of the coin as possible
        // if it doesnt run out
          // finish
        // else 
          // order will sit there for the remainign unpurchased Quantity
      // if limit order > highest current bid
        // POST new ORDER to DB 
    } 
     
           
    

    // reduce the user's USD balance by volume
    // increase the user's coin balance by coin volume bought

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
              <BuyCard usdBalance  = {this.state.usdBalance} currentCoin = {this.state.currentCoin} clickFn = {this.handleBuyButtonClick.bind(this)}/>
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
