import React from 'react';
import ExchangeBookRow from './ExchangeBookRow.jsx';


class MarketsCard extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      currentCoin: 'Bitcoin'
    }

  }





  render() {

    const coins = [{name: 'Bitcoin', pair: 'BTC/USD'}, {name: 'Ethereum', pair: 'ETH/USD'}, 
    {name: 'Ripple', pair: 'XRP/USD'}, {name: 'Ethereum', pair: 'ETH/BTC'}, {name: 'Ripple', pair: 'XRP/BTC'}];
    // this.props.orders.map((order, index) => <OrderBookRow order = {order} key = {index}/>)
    // should always show all markets
  	return (

  	 <div id="dashCard" className="ui blue raised card" name='Graph' onClick={this.props.changeLayout}> 
        <div className="content" > 
        <h3> Exchange Markets </h3>
        <table className = "ui selectable celled table">
          <thead>
            <tr> 
              <th> Name </th>
              <th> Pair </th>
              <th> Price </th>
              <th> Change </th>
              <th> Vol 24h </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => <ExchangeBookRow key = {index} index = {index} clickFn = {this.props.clickFn} name = {coin.name} pair = {coin.pair}/>)} 
          </tbody>
        </table> 
        </div>
     </div>  

  	)
  }

}



export default MarketsCard;