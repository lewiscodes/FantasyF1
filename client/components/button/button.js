import React, { Component, PropTypes } from 'react'
import cx from 'classnames';
require('./sass/button.scss');

export default class Button extends Component {
  render() {
    const {
      style,
      color
    } = this.props;

    const className = cx({
        'button': true,
        [`button--style-${style}`]: style !== undefined
    });

    const buttonColor = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.color
    }

    return (
      <div className={className} style={buttonColor} onClick={this.props.onClickFunction}>
        <span className="button__text">{this.props.text}</span>
      </div>
    )
  }
}

Button.propTypes = {
    style: PropTypes.oneOf(['floating', 'raised', 'flat'])
};
