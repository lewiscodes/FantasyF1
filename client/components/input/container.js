import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import InputComponent from './input';
require('./sass/input.scss');

class Input extends Component {
  render () {
    const classes = cx({
        'input': true,
        [`input--style-${this.props.style}`]: this.props.style !== undefined
    });

    return (
      <InputComponent
        text={this.props.text}
        classes={classes}
        inputType={this.props.inputType}
      />
    )
  }
}

Input.propTypes = {
  inputType: PropTypes.oneOf(["text", "password"])
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps)(Input);
