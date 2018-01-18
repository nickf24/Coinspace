import React from 'react';
import moment from 'moment';

class PastTradesRow extends React.Component {


  constructor(props) {
  	super(props);
  }

//
  render() {
  	// if this.props.index === even 
  	// render row as class 'white'
  	// else
    //2018-01-18T19:27:02.000Z  
    // if (this.props.time_executed)
    // const postDatetime = moment(this.props.time_executed, moment.ISO_8601);
    // const now = moment();
    // console.log(postDatetime, now);
    // const timeAgo = now.diff(postDatetime, 'seconds');
  	  // render row as class 'grey'
    let time = null;
    let quantity = null;
    let price = null;

    if (this.props.order) {
      quantity = <td> {this.props.order.quantity} </td>
      price = <td> {Number(this.props.order.price)} </td>
      const postDatetime = moment(this.props.order.time_executed, moment.ISO_8601);
      const now = moment();
      const timeAgo = now.diff(postDatetime, 'minutes');
      time = <td> {timeAgo} minutes ago </td>
    }
  	return (

  		<tr>
  			{time}
        {quantity}
        {price}
  		</tr>

  	)
  }

}

export default PastTradesRow;