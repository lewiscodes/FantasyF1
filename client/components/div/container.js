import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';

import { getFirstDiv, getSecondDiv } from '../../actions/index';
import DivComponent from './div';

require('./sass/div.scss');

class Div extends Component {
  
  componentWillMount() {
    switch(this.props.div) {
      case "first":
        return this.props.getFirstDiv();
      case "second":
        return this.props.getSecondDiv();
      default:
        return null;
    }
  }
  
  render () {
    const classes = cx({
        'div': true,
        [`div--style-${this.props.style}`]: this.props.style !== undefined
    });
    
    return (
      <DivComponent
        text={this.props.text}
        classes={classes}
      />
    )
  }
}

Div.propTypes = {
    style: PropTypes.oneOf(['standard', 'secondary']),
    div: PropTypes.oneOf(['first', 'second'])
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getFirstDiv, getSecondDiv }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Div);