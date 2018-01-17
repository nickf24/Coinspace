import React from 'react';
import axios from 'axios';
import TotalAllocations from './TotalAllocations.jsx';
import CoinChartCard from './CoinChartCard.jsx';
import BuyOrdersCard from './BuyOrdersCard.jsx';
import SellOrdersCard from './SellOrdersCard.jsx';
import PastTradesCard from './PastTradesCard.jsx';
import TopCryptoNews from './TopCryptoNews.jsx';
import ActivityFeed from './ActivityFeed.jsx';
import { Header, Input, Menu, Segment, Container, Divider, Grid, Sticky, Button, Icon, Image, Statistic } from 'semantic-ui-react';

class TradingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Markets',
      coinAllocation: [100, 25, 35]
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
  }

  componentDidMount() {
    axios.get('/sign/balance').then((response) => {
      console.log('RESPONSE FROM GET IS', response);
    }).catch((error) => {
      console.log('error on get', error);
    })
  }


  changeLayout (e) {
    console.log(e.target);
  }

  getCoinAllocation() {
    var bitcoinQuantity = parseInt(document.getElementById('bitcoinInput').value);
    var ethereumQuantity = parseInt(document.getElementById('ethereumInput').value);
    var litecoinQuantity = parseInt(document.getElementById('litecoinInput').value);
    this.setState({
      coinAllocation: [bitcoinQuantity, ethereumQuantity, litecoinQuantity]
    })
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
            <h2 className="header centered"> {this.state.page} </h2>
            <div className="ui two stackable cards">
              <CoinChartCard chartData={this.chartData} currentCoinData={this.props.state}/> 
              <PastTradesCard />
              <BuyOrdersCard />
              <SellOrdersCard />

              {/* -------------- The Content Space HTML Ends here -------------------------*/}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default TradingPage;
