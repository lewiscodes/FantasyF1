import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import App from './components/app';
import LandingPage from './containers/landingPage'
import Home from './containers/home';
import ForgottenPassword from './containers/forgottenPassword';
import Register from './containers/register';
import UserLogon from './containers/userLogon'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage}/>
    <Route path="forgottenpassword" component={ForgottenPassword} />
    <Route path="register" component={Register} />
    <Route path="login" component={UserLogon} />
    <Route path="home" component={Home} />
  </Route>
);
