import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Main from './containers/main'
import Logon from './containers/logon';
// import ForgottenPassword from './containers/forgottenPassword';
// import Register from './containers/register';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Logon} />
      <Route path="logon" component={Logon} />
  </Route>
);
