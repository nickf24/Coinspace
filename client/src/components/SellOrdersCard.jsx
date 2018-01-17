import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';
const axios = require('axios')


class SellOrdersCard extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    var instance = this;
    axios.get('/sells').then((response) => {
      // console.log('SELLS ARE', response);
      instance.setState({
        orders: response.data.rows.slice(0, 50)
      })
    })
  }


  render() {
    // this.props.orders.map((order, index) => <OrderBookRow order = {order} key = {index}/>)
    // should only show markets for this.props.currentCoin
  	return (

  	 <div id="dashCard" className="ui blue raised card orderBook" name='Graph' onClick={this.props.changeLayout}> 
        <div className="content"> 
        <h3> Sell Orders </h3>
        <table className = "ui celled table">
          <thead>
            <tr> 
              <th> Price (USD) </th>
              <th> Volume (ETH) </th>
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



export default SellOrdersCard;