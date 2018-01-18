import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';
const axios = require('axios')

class BuyOrdersCard extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
    
    var divStyle = {
      'overflowY': "scroll"
    }

    var orderRows = null;
    if (this.props.orders) {
      orderRows = <tbody>{this.props.orders.map((order, index) => <OrderBookRow key = {index} order = {order}/>)}</tbody>
    }
    return (

     <div id="dashCard" className="ui blue raised card" name='Graph' onClick={this.props.changeLayout} style = {divStyle}> 
        <div className="content"> 
        <h3> Buy Orders </h3>
        <table className = "ui celled table">
          <thead className = "orderBookHeader">
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



export default BuyOrdersCard;
