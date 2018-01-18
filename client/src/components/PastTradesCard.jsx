import React from 'react';
import OrderBookRow from './OrderBookRow.jsx';


class PastTradesCard extends React.Component {
  constructor(props) {
  	super(props);
  }


  render() {
  	return (

  	  <div id="dashCard" className="ui blue raised card" name='Graph' onClick={this.props.changeLayout}> 
        <div className="content"> 
        <h3> Last 50 Trades </h3>
        <table className = "ui celled table">
          <thead>
            <tr> 
              <th> Time </th>
              <th> Volume </th>
              <th> Price </th>
            </tr>
          </thead>
          <tbody> 
            <OrderBookRow />

          </tbody>
        </table> 
        </div>
     </div>  

  	)
  }

}



export default PastTradesCard;