import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Logon from './components/logon/container';
import ForgottenPassword from './components/forgottenPassword/container';
import Register from './components/register/container';

export default (
  <Route path="/" component={Logon} >
    <Route path="logon" component={Logon} />
    <Route path="password" component={ForgottenPassword} />
    <Route path="register" component={Register} />
  </Route>
);
