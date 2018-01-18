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

    axios.get('/user').then((response) => {
      var data = response.data.rows[0].row.split(',');
      var btcBal = convertToNum(data[0]);
      var ethBal = convertToNum(data[1]);
      var xrpBal = convertToNum(data[2]);
      var usdBal = convertToNum(data[3]);


      instance.setState({
        usdBalance: usdBal,
        ethBalance: ethBal,
        xrpBalance: xrpBal,
        btcBalance: btcBal
      })

    }).catch((error) => {
      console.log('error on get', error);
    })
    
    // console.log('IN BUY ORDERS CARD', this.props.currentCoin);
    var currentPair = this.state.currentCoin.split('/').join('');
    axios.get(`/buys/${currentPair}`).then((response) => {
      var buysResponse = response;
        axios.get(`/buys/${currentPair}`).then((response) => {
          // console.log('BUYS ARE', response);
          instance.setState({
            sellOrders: response.data.rows.slice(0, 50),
            buyOrders: buysResponse.data.rows.slice(0, 50)
          })
        }).catch((error) => {
          console.log(error);
        })
    }).catch((error) => {
      console.log(error);
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
          instance.setState({
            sellOrders: response.data.rows.slice(0, 50),
            buyOrders: buysResponse.data.rows.slice(0, 50),
            currentCoin: name
          })
        }).catch((error) => {
          console.log(error);
        })
    }).catch((error) => {
      console.log(error);
    })
  
  }

  handleBuyButtonClick(volume, price, type) {
    // console.log('HERE')
    console.log(volume, price, type, this.state.usdBalance, this.state.btcBalance);

    // execute the order
    // if market order
    var instance = this;
    if (type === 'market' || type === undefined) {
      // get the first order
      console.log(this.state.sellOrders);
      var makeSale = function(usdBalance, orderVol, orderPrice, sellOrders) {
        if (usdBalance <= 0) {
          // base case
          return;
        } 
        // else go through order and complete
        var firstOrder = sellOrders[0];
        if (Number(firstOrder.quantity) > volume) {
          if (instance.state.usdBalance > (volume * price)) {

            // if buyer has enough usd_balance to cover price
            // PATCH order to be executed T at the time
            // PATCH user to update usd_balance and coin balance
            var newUsdBalance = instance.state.usdBalance - volume * price;
            var newCoinBalance = Number(volume);
            var currentCoin = instance.state.currentCoin;
            currentCoin = currentCoin.split('/')[0];

            console.log(newUsdBalance, newCoinBalance, currentCoin);

            // axios.patch('/userBalance', {})

          } else {
            console.log('Not enough $$$ in the bank to make this trade!')
          }
        } else {
          // first order does not have enough vol to cover
          // go through and buy up all of first over
          // make sales with rest of sell orders/remaining balance
          makeSale(usdBalance) 
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
              <SellCard currentCoin = {this.state.currentCoin} btcBalance = {this.state.btcBalance} ethBalance = {this.state.ethBalance} xrpBalance = {this.state.xrpBalance}/>
            </div>  
            <div className="ui divider"></div> 
            <div className="ui two stackable cards centered">
              <MarketsCard clickFn = {this.handleExchangeBookClick.bind(this)} currentCoin = {this.state.currentCoin}/>
              <PastTradesCard currentCoin = {this.state.currentCoin}/>
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
