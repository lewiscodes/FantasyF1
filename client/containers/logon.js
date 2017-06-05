import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { getLogon } from '../actions/index';
import Button from '../components/button/container';
require('./sass/logon.scss');

class Logon extends Component {
  
  loginFunction = () => {
    console.log("login attempted");
    this.props.getLogon("lewis","1234");
  }

  registerFunction = () => {
    console.log("open registration form");
  }

  forgottenPasswordFunction = () => {
    console.log("forgotten password form");
  }
  
  render() {

    const className = cx({
        'logon': true,
        [`logon--style-${this.props.style}`]: this.props.style !== undefined
    });

    let randomNumber = Math.floor(Math.random() * 4) + 1;
    const background = {
      backgroundImage: "url(./assets/background" + randomNumber + ".jpg)"
    }
    
    return (
      <div className={className}>
        <div className="logon__wrapper">
          <div className="headerWrapper">
            <div className="header">
              <h1>Fantasy Formula One</h1>
            </div>
            <div className="background">
              <div style={background} className="backgroundImage"></div>
            </div>
          </div>
          <div className="subHeader">Login or Register.</div>
          <form>
            <div className="inputs">
              <label>User name</label>
              <input type="text" className="logon__username"/>
              <label>Password</label>
              <input type="password" className="logon__password"/>
            </div>
            <Button style="raised" color="#ecf0f1" backgroundColor="#2c3e50" text="Log In" onClickFunction={this.loginFunction}/>
          </form>
          <Button style="flat" color="#2c3e50" backgroundColor="#ecf0f1" text="register" onClickFunction={this.registerFunction}/>
          <Button style="flat" color="#2c3e50" backgroundColor="#ecf0f1" text="forgotten password" onClickFunction={this.forgottenPasswordFunction}/>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getLogon }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logon);
