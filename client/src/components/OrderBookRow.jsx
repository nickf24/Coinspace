import React from 'react';


class OrderBookRow extends React.Component {


  constructor(props) {
  	super(props);
  }

  render() {
  	// if this.props.index === even 
  	// render row as class 'white'
  	// else
  	  // render row as class 'grey'
    let price = null;
    let quantity = null;
    let value = null;
    if (this.props.order) {
      // console.log(this.props.order.price)
      price = <td> {this.props.order.price} </td>
      quantity = <td> {this.props.order.quantity} </td>
      value = <td> {Number(this.props.order.price) * Number(this.props.order.quantity)} </td>
    }
  	return (




  		<tr>
  			{price}
        {quantity}
        {value}
  		</tr>

  	)
  }

}

export default OrderBookRow;