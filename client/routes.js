import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import App from './components/app';
import Main from './containers/main'
import Home from './containers/home';
import ForgottenPassword from './containers/forgottenPassword';
import Register from './containers/register';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="home" component={Home} />
    <Route path="forgottenpassword" component={ForgottenPassword} />
    <Route path="register" component={Register} />
  </Route>
);
