import React, { Component, PropTypes } from 'react'
import cx from 'classnames';
require('./sass/div.scss');

export default class Div extends Component {
  render() {
    const {
      style
    } = this.props;
    
    const className = cx({
        'div': true,
        [`div--style-${style}`]: style !== undefined
    });
    
    return (
      <div className={className}>
        <span className="div__text">{this.props.text}</span>
      </div>
    )
  }
}

Div.propTypes = {
    style: PropTypes.oneOf(['standard', 'secondary'])
};