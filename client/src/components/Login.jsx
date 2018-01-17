import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import $ from 'jquery';
import 'semantic-ui/dist/semantic.min.js';
import 'semantic-ui/dist/semantic.min.css';
import PasswordMask from 'react-password-mask';
import { Button, Dimmer, Loader, Image, Segment, Transition, Form, Message, Icon, Checkbox, Divider, Header } from 'semantic-ui-react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	open: this.props.openLogin,
      success: '',
    }
  }

  onOpenModal() {
    this.setState({ open: true });
  };
 
  onCloseModal() {
    this.setState({ open: false });
    this.props.closeLoginModal();
  };

  onClickSignUp() {
    var registrationInfo = {
      username: document.getElementById('signUpUsername').value,
      password: document.getElementById('signUpPassword').value
    }

    this.onSignUp(registrationInfo);
  }

  onSignUp(newAccount) {
    var registration = this;
  	axios.post('/sign/up', newAccount)
    .then(function(response) {
      console.log('server response: ', response.data);
    	registration.onSuccessfulSignUp(response.data);
    })
    .catch(function(error) {
      // console.dir(error.response.data.msg);
    })
  }

  onSuccessfulSignUp(userid) {
    this.setState({success: 'true'})
  	setTimeout(() => {this.props.userLogin(userid)}, 5000)
  }

  onUnsuccessfulSignUp() {
    this.setState({success: 'false'})
  }

  onClickSignIn() {
  	var emailAddress = document.getElementById('signInEmail').value;
    var enteredPassword = document.getElementById('signInPassword').value;
    this.onSignIn(emailAddress, enteredPassword);
  }

  onSignIn(emailAddress, enteredPassword) {
    var login = this;
  	axios.post('/sign/in', {
  		username: emailAddress,
  		password: enteredPassword
  	})
  	.then(function(response) {
      console.log(response);
    	login.onSuccessfulSignUp(response.data);
    })
    .catch(function(error) {
      console.log('this is the error on sign in', error);
    })
  }

  onSuccessfulSignIn(userData) {
    this.setState({success: 'true'})
    setTimeout(() => {this.props.userLogin(userData)}, 500)
  }

  onUnsuccessfulSignIn() {
    this.setState({success: 'false'})
  }

  render() {
  	return (
  		<div>
        <Modal open={this.state.open} onClose={this.onCloseModal.bind(this)} id="loginModal">
          <Header as='h2'><Icon name='money' color='green'/><Header.Content>Become A Crypto Millionaire!</Header.Content></Header>
          <Divider hidden />
          <Form><Form.Field><label>Create A Username</label>  
          <input id="signUpUsername" type="text" placeholder="Enter Username"></input>
          </Form.Field></Form>
          <Form><Form.Field><label>Create A Password</label> 
          <PasswordMask id="signUpPassword" placeholder="Enter Password" useVendorStyles={false}/>
          </Form.Field></Form>
           <Checkbox toggle label='I Agree To The Terms & Conditions'/>
           <Divider hidden />
          <Button onClick={this.onClickSignUp.bind(this)} basic color='green' animated>
          <Button.Content visible>Sign Up!</Button.Content><Button.Content hidden>
          <Icon name='right arrow'/></Button.Content></Button>
          <Divider hidden />
          <Header as='h2'><Icon name='thumbs outline down' color='red'/><Header.Content>Check Your Altcoin Losses</Header.Content></Header>
          <Divider hidden />
          <Form><Form.Field><label>Email Address</label> 
          <input id="signInEmail" type="text" placeholder="Email Address"></input>
          </Form.Field></Form>
          <Form><Form.Field><label>Password</label> 
          <PasswordMask id="signInPassword" placeholder="Password" useVendorStyles={false}/>
          </Form.Field></Form>
          <Button onClick={this.onClickSignIn.bind(this)} inverted color='blue'>Sign In!</Button>
          <Divider hidden />
          {this.state.success === 'true' ? (<Form success>
            <Message
              success
              header='Success!'
              content="You can now view your Portfolio!"
            />
          </Form>) : this.state.success === 'false' ? (<Form error>
            <Message
              error
              header='Unsuccessful'
              content='There was an issue with the sign in.'
            />
          </Form>) : null}
        </Modal>
      </div>
  	)
  }
}

export default Login;