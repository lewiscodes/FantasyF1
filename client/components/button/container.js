import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import ButtonComponent from './button';
require('./sass/button.scss');

class Button extends Component {
  render () {
    const classes = cx({
        'button': true,
        [`button--style-${this.props.style}`]: this.props.style !== undefined
    });

    return (
      <ButtonComponent
        text={this.props.text}
        classes={classes}
        onClickFunction={this.props.onClickFunction}
        isLink={this.props.isLink}
        link={this.props.link}
      />
    )
  }
}

Button.propTypes = {
    isLink: PropTypes.oneOf([true, false])
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps)(Button);
