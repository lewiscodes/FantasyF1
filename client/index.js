import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import {Router, browserHistory } from 'react-router';
import reducers from './reducers';
import routes from './routes';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import 'whatwg-fetch';

const fetch = window.fetch.bind(window);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = createStore(reducers, composeEnhancers(
  applyMiddleware(promise, thunk)
));

ReactDOM.render(
  <Provider store={createStoreWithMiddleware}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>
  , document.querySelector('.container'));
