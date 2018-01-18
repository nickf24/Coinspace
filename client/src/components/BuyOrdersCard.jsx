import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';
const axios = require('axios')

class BuyOrdersCard extends React.Component {
  constructor(props) {
  	super(props);
  }

  componentDidMount() {
    // var instance = this;
    // console.log('IN BUY ORDERS CARD', this.props.currentCoin);
    // var currentPair = this.props.currentCoin.split('/').join('');
    // axios.get(`/buys/${currentPair}`).then((response) => {
    //   console.log('BUYS ARE', response);
    //   instance.setState({
    //     orders: response.data.rows.slice(0, 50)
    //   })
    // })
  }


  render() {
  	// should only show markets for this.props.currentCoin
    var divStyle = {
      'overflowY': "scroll"
    }
    // var instance = this;
    //  var currentPair = this.props.currentCoin.split('/').join('');
    // axios.get(`/buys/${currentPair}`).then((response) => {
    //   console.log('BUYS ARE', response);
    //   instance.setState({
    //     orders: response.data.rows.slice(0, 50)
    //   })
    // })
    // console.log(this.props.orders);
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
