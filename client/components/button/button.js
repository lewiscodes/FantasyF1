import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default (props) => {
  if (props.isLink) {
    return (
      <Link to={props.link} >
        <div className={props.classes}>
          <span className="button__text">{props.text}</span>
        </div>
      </Link>
    );
  } else {
    return (
      <div className={props.classes} onClick={props.onClickFunction}>
        <span className="button__text">{props.text}</span>
      </div>
    );
  }
}
