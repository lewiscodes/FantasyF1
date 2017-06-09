import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { getLogon } from '../actions/index';
import Button from '../components/button/container';
require('./sass/userLogon.scss');

class UserLogon extends Component {

  loginFunction = () => {
    const username = document.getElementsByClassName("logon__username")[0].value;
    const password = document.getElementsByClassName("logon__password")[0].value;
    this.props.getLogon(username, password);
  }

  registerFunction = () => {
    console.log("open registration form");
  }

  forgottenPasswordFunction = () => {
    console.log("forgotten password form");
  }

  handleReturn = (event) => {
    if (event.key === 'Enter') {
      this.loginFunction();
    }
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

    let logonFailed = {visibility:"hidden"};
    if (this.props.logon.logonError) {
      logonFailed = {visibility:"visible"}
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
          <div className="logonFailed" style={logonFailed}>Logon Failed. Please try again.</div>
          <form>
            <div className="inputs">
              <label>User name</label>
              <input type="text" className="logon__username" onKeyUp={this.handleReturn}/>
              <label>Password</label>
              <input type="password" className="logon__password" onKeyUp={this.handleReturn}/>
            </div>
            <Button style="raised" color="#ecf0f1" backgroundColor="#2c3e50" text="Log In" onClickFunction={this.loginFunction} isLink={false} />
          </form>
          <Button style="flat" color="#2c3e50" backgroundColor="#ecf0f1" text="register" isLink={true} link="register"/>
          <Button style="flat" color="#2c3e50" backgroundColor="#ecf0f1" text="forgotten password" isLink={true} link="forgottenpassword/"/>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getLogon }, dispatch)
}

function mapStateToProps(state) {
  return { logon: state.logonReducer }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogon);
