import React, { Component } from 'react';
import Button from './button/button'

export default class App extends Component {
  render() {
    return (
      <div>
        <Button style="floating" color="green" text="?" />
        <Button style="raised" color="amber" text="LOGIN" />
        <Button style="flat" color="red" text="CANCEL" />
      </div>
    );
  }
}
