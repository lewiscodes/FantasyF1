import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Div from '../components/div/container';
import Button from '../components/button/container';

class Main extends Component {
  render() {
    return (
      <div>
        <Div style="standard" text={this.props.firstDiv} div="first"></Div>
        <Div style="secondary" text={this.props.secondDiv} div="second"></Div>
        <Button style="floating" color="green" text="?" />
        <Button style="raised" color="orange" text="LOGIN" />
        <Button style="flat" color="red" text="CANCEL" />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({  }, dispatch)
}

function mapStateToProps(state) {
  return { firstDiv: state.divReducer.firstDiv, secondDiv: state.divReducer.secondDiv }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
