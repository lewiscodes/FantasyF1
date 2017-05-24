import React, { Component } from 'react';
import Div from './div/container';

export default class App extends Component {
  render() {
    return (
      <div>
        <Div style="standard" text="This div is rendered by React!"/>
        <Div style="secondary" text="Secondary div"/>
      </div>
    );
  }
}
