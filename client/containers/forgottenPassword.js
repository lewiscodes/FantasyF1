import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import Button from '../components/button/container';
require('./sass/forgottenpassword.scss');

class ForgottenPassword extends Component {
  
  handleForgottenPassword = () => {
    alert("send password reset email")
  }
  
  handleReturn = (event) => {
    if (event.key === 'Enter') {
      this.handleForgottenPassword();
    }
  }
  
  render() {
    
    const className = cx({
        'forgottenpassword': true,
        [`forgottenpassword--style-${this.props.style}`]: this.props.style !== undefined
    });
    
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    const background = {
      backgroundImage: "url(../assets/background" + randomNumber + ".jpg)"
    }
    
    return (
      <div className={className}>
        <div className="forgottenpassword__wrapper">
          <div className="headerWrapper">
            <div className="header">
              <h1>Fantasy Formula One</h1>
            </div>
            <div className="background">
              <div style={background} className="backgroundImage"></div>
            </div>
          </div>
          <div className="subHeader">Forgotten your Password.</div>
            <form>
              <div className="inputs">
                <label>Email</label>
                <input type="text" className="forgottenpassword__email" onKeyUp={this.handleReturn}/>
              </div>
              <Button style="raised" color="#ecf0f1" backgroundColor="#2c3e50" text="Reset Password" onClickFunction={this.handleForgottenPassword} isLink={false} />
            </form>
            <Button style="flat" color="#2c3e50" backgroundColor="#ecf0f1" text="back to logon" isLink={true} link="/"/>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPassword);