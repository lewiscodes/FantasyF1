import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import Button from '../components/button/container';
import Input from '../components/input/container'
import Checkbox from '../components/checkbox/container';
require('./sass/register.scss');

class Register extends Component {

  render() {

    const className = cx({
        'register': true,
        [`register--style-${this.props.style}`]: this.props.style !== undefined
    });

    return (
      <div className={className}>
        <img className="logo" src="../assets/logo.svg"/>
        <Input text="USERNAME" inputType="text" />
        <Input text="EMAIL" inputType="text" />
        <Input text="PASSWORD" inputType="password" />
        <Input text="RE-TYPE PASSWORD" inputType="password" />
        <Button text="Register" style='wide'/>
        <Checkbox text="I agree to the " link="/terms_and_conditions" linkText="Terms and Conditions."/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
