import React from 'react';
import PastTradesRow from './PastTradesRow.jsx';


class PastTradesCard extends React.Component {
  constructor(props) {
  	super(props);
  }


  render() {
    var rows = null;
    var divStyle = {
      'overflowY': "scroll"
    }
    if (this.props.pastTrades) {
      rows = <tbody>{this.props.pastTrades.map((trade, index) => <PastTradesRow key = {index} order = {trade} /> )}</tbody> 
    }
    

  	return (
     <div id="dashCard" className="ui blue raised card orderBook" name='Graph' onClick={this.props.changeLayout} style = {divStyle}> 
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
          {rows}
        </table> 
        </div>
     </div>  
  	)
  }

}



export default PastTradesCard;
  