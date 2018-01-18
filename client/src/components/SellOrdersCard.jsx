import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';
const axios = require('axios')


class SellOrdersCard extends React.Component {
  constructor(props) {
  	super(props);
 
  }


  render() {
    // this.props.orders.map((order, index) => <OrderBookRow order = {order} key = {index}/>)
    // should only show markets for this.props.currentCoin
    var divStyle = {
      'overflowY': "scroll"
    }
    var orderRows = null;
    if (this.props.orders) {
      orderRows = <tbody>{this.props.orders.map((order, index) => <OrderBookRow key = {index} order = {order}/>)}</tbody>
    }
  	return (

  	 <div id="dashCard" className="ui blue raised card orderBook" name='Graph' onClick={this.props.changeLayout} style = {divStyle}> 
        <div className="content"> 
        <h3> Sell Orders </h3>
        <table className = "ui celled table">
          <thead>
            <tr> 
              <th> Price (USD) </th>
              <th> Volume {this.props.currentCoin} </th>
              <th> Value (USD) </th>
            </tr>
          </thead>
          {orderRows}
        </table> 
        </div>
     </div>  

  	)
  }

}



export default SellOrdersCard;