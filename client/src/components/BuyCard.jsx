import React from 'react';



class BuyCard extends React.Component {

  constructor(props) {
  	super(props)
  }


  render() {

  	return (

  		<div id="dashCard3" className="ui blue raised card"> 
  		  <form id = 'buyForm' className = 'ui mini form'>
  		    <fieldset>
  		  	  <h3> Buy Bitcoin </h3>
			  <div id = 'availableBalance' className = 'field'>
	  		    <h5> Available USD: </h5>
	  		    <span> $100,000 </span>
	  		  </div>
	  		  <div className = "field">
	  		    <h5> Order Type: </h5>
	      		<div className ="ui radio checkbox">
	        		<input type="radio" name="market"/>
	        		<label>Market</label>
	      		</div>

	      		&nbsp;
	      		&nbsp;
	      	    <div className = "ui radio checkbox">
	        	  <input type="radio" name="market"/>
	        	  <label>Limit</label>
	      	    </div>
	    	  </div>

	  		  <div id = 'selectVolume' className = 'field'>
	  		  	<h5> Volume: </h5>
	  		  	<input type = 'text' id = 'buyVolume' placeholder = 'amount to receive'/>
	  		  </div>
	  		  <div id = 'selectPrice' className = 'field'>
	  		  	<h5> Price: </h5>
	  		  	<input type = 'text' id = 'buyPrice'/> 
	  		  </div>
	  		  <div id = 'totalAmount' className = 'field'>
	  		  	<h5> Spend Total: </h5>
	  		  	<span id = 'totalBuyOrder'> - </span>
	  		  </div>
	  		  <div id = 'submitOrder'>
	  		  	<button className = 'ui primary button'> Buy ETH </button>
	  		  </div>
	  		</fieldset>
  		  </form> 

  		</div>
  	)
  }

}














export default BuyCard;
