import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import CheckboxComponent from './checkbox';
require('./sass/checkbox.scss');

class Checkbox extends Component {
  render () {
    const classes = cx({
        'checkbox': true,
        [`checkbox--style-${this.props.style}`]: this.props.style !== undefined
    });

    return (
      <CheckboxComponent
        text={this.props.text}
        classes={classes}
        link={this.props.link}
        linkText={this.props.linkText}
      />
    )
  }
}

Checkbox.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps)(Checkbox);
