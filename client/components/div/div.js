import React, { Component } from 'react'

export default (props) => {
  return (
    <div className={props.classes}>
      <span className="div__text">{props.text}</span>
    </div>
  );
}