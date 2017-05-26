import React, { Component, PropTypes } from 'react'
import cx from 'classnames';
require('./sass/logon.scss');

import Button from '../button/container';
var Background1 = './assets/background1.jpg'

export default class Logon extends Component {
  render() {
    const {
      style,
      color
    } = this.props;
    
    const className = cx({
        'logon': true,
        [`logon--style-${style}`]: style !== undefined
    });
    
    const background = {
      backgroundImage: "url(./assets/background1.jpg)",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      borderRadius: "100%",
      height: "510px",
      width: "510px"
    }
    
    return (
      <div className={className}>
        <div className="logon__wrapper">
          <div style={background}></div>
          <input type="text" placeholder="USERNAME" className="logon__username"/>
          <input type="password" placeholder="PASSWORD" className="logon__password"/>
          <Button style="raised" color="green" text="LOGIN"/>
          <a href="#" className="logon__forgotten">forgotten your password?</a>
        </div>
      </div>
    )
  }
}

Logon.propTypes = {};