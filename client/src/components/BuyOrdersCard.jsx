import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';
const axios = require('axios')

class BuyOrdersCard extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    var instance = this;
    axios.get('/buys').then((response) => {
      // console.log('BUYS ARE', response);
      instance.setState({
        orders: response.data.rows.slice(0, 50)
      })
    })
  }


  render() {
  	// should only show markets for this.props.currentCoin
    var divStyle = {
      'overflowY': "scroll"
    }
    return (

     <div id="dashCard" className="ui blue raised card" name='Graph' onClick={this.props.changeLayout} style = {divStyle}> 
        <div className="content"> 
        <h3> Buy Orders </h3>
        <table className = "ui celled table">
          <thead className = "orderBookHeader">
            <tr> 
              <th> Price (USD) </th>
              <th> Volume (BTC) </th>
              <th> Value (USD) </th>
            </tr>
          </thead>
          <tbody> 
          {this.state.orders.map((order, index) => <OrderBookRow key = {index} order = {order}/>)}

          </tbody>
        </table> 
        </div>
     </div>  

  	)
  }

}



export default BuyOrdersCard;