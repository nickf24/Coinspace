import React from 'react';


class PastTradesCard extends React.Component {
  constructor(props) {
  	super(props);
  }


  render() {
  	return (

  	  <div id="dashCard" className="ui blue raised card" name='Graph' onClick={this.props.changeLayout}> 
        <div className="content"> 
  	  	This is a past trades card
        </div>
  	  </div> 	

  	)
  }

}



export default PastTradesCard;