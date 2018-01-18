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
    // axios.get('/').then((response) => {
    //   console.log('RESPONSE FROM GET IS', response);
    // }).catch((error) => {
    //   console.log('error on get', error);
    // })
    var instance = this;
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
  
    // console.log('name is', this.state.currentCoin);

  }

  // changeLayout (e) {
  //   this.setState({
  //     page: e.target.name
  //   });
  // }

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
              <BuyCard />
              <SellCard />
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
