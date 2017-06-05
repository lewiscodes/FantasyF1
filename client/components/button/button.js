import React, { Component, PropTypes } from 'react'

export default (props) => {
  return (
    <div className={props.classes} style={props.buttonColor} onClick={props.onClickFunction}>
      <span className="button__text">{props.text}</span>
    </div>
  );
}