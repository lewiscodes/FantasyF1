import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default (props) => {
  return (
    <Link className={props.classes} to={props.link}>{props.text}</Link>
  );
}
