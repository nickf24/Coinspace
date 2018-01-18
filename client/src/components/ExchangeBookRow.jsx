import React from 'react';


class ExchangeBookRow extends React.Component {


  constructor(props) {
  	super(props);
  	this.state = {
  	  isActive: false
  	}
  }

  // toggleActive() {
  // 	console.log(this.state.isActive)
  // 	this.setState((prevState) => {
  // 	  isActive: true
  // 	})
  // }

  render() {
  	var classname = '';
  	if (this.props.index % 2 === 0) {
  	  classname = 'grey';
  	}

  	if (this.state.isActive) {
  	  classname = 'grey';
  	}

  	return (
  	  <tr onClick = {() => this.props.clickFn(this.props.pair)} className = {classname} id = 'hover'> 
        <td> {this.props.name} </td>
        <td> {this.props.pair} </td>
        <td> {this.props.price} </td>
        <td> {this.props.change} </td>
        <td> {this.props.volume} </td>
      </tr>
  	)
  }




}

export default ExchangeBookRow;