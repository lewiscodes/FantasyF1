import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import App from './components/app';
import Main from './containers/main'
import Logon from './containers/logon';
import ForgottenPassword from './containers/forgottenPassword';

export default (
  <Route path="/app/" component={App}>
    <IndexRoute component={Logon}/>
    <Route path="logon" component={Logon} />
    <Route path="forgottenpassword" component={ForgottenPassword} />
  </Route>
);
