import React, { Component, PropTypes } from 'react';

export default (props) => {
  return (
    <div className={props.classes}>
      <span className="button__text">{props.text}</span>
      <input type={props.inputType} />
    </div>
  );
}
