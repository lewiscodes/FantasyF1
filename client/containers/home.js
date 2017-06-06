import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import UserLogon from './userLogon';
require('./sass/home.scss');

class Home extends Component {
  render () {
    if (this.props.logon.userID !== null) {
      return (
        <div>HOME!</div>
      )
    } else {
      return <UserLogon />
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return { logon: state.logonReducer }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
