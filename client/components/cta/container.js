import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import CtaComponent from './cta';
require('./sass/cta.scss');

class Cta extends Component {
  render () {
    const classes = cx({
        'cta': true,
        [`cta--style-${this.props.style}`]: this.props.style !== undefined
    });

    return (
      <CtaComponent
        text={this.props.text}
        classes={classes}
        link={this.props.link}
      />
    )
  }
}

Cta.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return {  }
}

export default connect(mapStateToProps)(Cta);
