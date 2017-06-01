import React, { Component, PropTypes } from 'react'
import cx from 'classnames';
import { getLogon } from '../../actions/index';
require('./sass/logon.scss');

import Button from '../button/container';
var Background1 = './assets/background1.jpg'

export default class Logon extends Component {

  loginFunction = () => {
    console.log("login attempted");
    getLogon("lewis","1234");
  }

  registerFunction = () => {
    console.log("open registration form");
  }

  forgottenPasswordFunction = () => {
    console.log("forgotten password form");
  }

  render() {
    const {
      style
    } = this.props;

    const className = cx({
        'logon': true,
        [`logon--style-${style}`]: style !== undefined
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

Logon.propTypes = {};
