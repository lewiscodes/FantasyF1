import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default (props) => {
  return (
    <div className={props.classes}>
      <input type="checkbox" id="option"/>
      <div className="text">
        <label for="option">{props.text}</label>
        <Link to={props.link}>{props.linkText}</Link>
      </div>
    </div>
  );
}
