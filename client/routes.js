import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Logon from './components/logon/container';

export default (
  <Route path="/" component={Logon} >
    <Route path="/logon" component={Logon} />
  </Route>
);
