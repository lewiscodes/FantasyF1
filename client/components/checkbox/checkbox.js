import React, { Component, PropTypes } from 'react';

export default (props) => {
  return (
    <div className={props.classes}>
      <input type="checkbox" id="option"/>
      <label for="option">{props.text}</label>
    </div>
  );
}
