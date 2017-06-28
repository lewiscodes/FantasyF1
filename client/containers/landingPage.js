import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { getLogon } from '../actions/index';
import Button from '../components/button/container';
require('./sass/landingPage.scss');

class LandingPage extends Component {
  render() {

    const className = cx({
        'landingPage': true,
        [`landingPage--style-${this.props.style}`]: this.props.style !== undefined
    });
    
    return (
      <div className={className}>
        <div className="buttonContainer">
          <img className="logo" src="./assets/logo.svg"/>
          <Button isLink={false} text="Register" style='narrow' />
          <Button isLink={false} text="Sign In" style='narrow' />
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getLogon }, dispatch)
}

function mapStateToProps(state) {
  return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
