import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import Button from '../components/button/container';
import Input from '../components/input/container'
require('./sass/forgottenpassword.scss');

class ForgottenPassword extends Component {
  
  render() {
    
    const className = cx({
        'forgottenpassword': true,
        [`forgottenpassword--style-${this.props.style}`]: this.props.style !== undefined
    });
    
    return (
      <div className={className}>
        <Input text="EMAIL" inputType="text"/>
        <Button isLink={false} text="Reset Password" style='wide' />
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