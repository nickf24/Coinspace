import React from 'react';
const $ = require('jquery');

class BuyCard extends React.Component {

  constructor(props) {
  	super(props)
  	this.state = {
  	  total: 0,
  	  checked: 'market'
  	}
  }

  onFormEntry(volume, price) {
  	this.setState({
  	  total: volume * price
  	})
  }

  render() {
  	var coin = this.props.currentCoin.split('/')[0];
  	// var radio = document.getElementsByName('marketBuy');
  	// for (var i = 0; i < radio.length; i++) {
  	//   console.log(radio[i])
  	//   if (radio[i].checked) {
  	//   	console.log('yo')
  	//   }
  	// }
   	return (

  		<div id="dashCard3" className="ui blue raised card"> 
  		  <form id = 'buyForm' className = 'ui mini form'>
  		    <fieldset>
  		  	  <h3> Buy {coin} </h3>
			  <div id = 'availableBalance' className = 'field'>
	  		    <h5> Available USD: </h5>
	  		    <span> {this.props.usdBalance} </span>
	  		  </div>
	  		  <div className = "field">
	  		    <h5> Order Type: </h5>
	      		<div className ="ui radio checkbox">
	        		<input type="radio" name="marketBuy" value = "market"/>
	        		<label>Market</label>
	      		</div>
	      		&nbsp;
	      		&nbsp;
	      	    <div className = "ui radio checkbox">
	        	  <input type="radio" name="marketBuy" value = "limit"/>
	        	  <label>Limit</label>
	      	    </div>
	    	  </div>

	  		  <div id = 'selectVolume' className = 'field'>
	  		  	<h5> Volume: </h5>
	  		  	<input type = 'text' id = 'buyVolume' placeholder = 'amount to receive'/>
	  		  </div>
	  		  <div id = 'selectPrice' className = 'field'>
	  		  	<h5> Price: </h5>
	  		  	<input type = 'text' id = 'buyPrice' onChange = {() => this.onFormEntry(document.getElementById('buyVolume').value, document.getElementById('buyPrice').value)}/> 
	  		  </div>
	  		  <div id = 'totalAmount' className = 'field'>
	  		  	<h5> Spend Total: </h5>
	  		  	<span id = 'totalBuyOrder'> {this.state.total} </span>
	  		  </div>
	  		  <div id = 'submitOrder'>
	  		  	<button className = 'ui primary button' type = 'button' onClick = {() => this.props.clickFn(document.getElementById('buyVolume').value,document.getElementById('buyPrice').value,  $('input[type="radio"][name="marketBuy"]:checked').val() )}> Buy {coin} </button>
	  		  </div>
	  		</fieldset>
  		  </form> 

  		</div>
  	)
  }

}














export default BuyCard;
