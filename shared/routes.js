import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import LoginContainer from './container/Auth/Login';
import SignupContainer from './container/Auth/Signup';
import Intro from './container/Auth/Intro';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Intro} />
    <Route path="/login" component={LoginContainer}/>
    <Route path="/signup" component={SignupContainer}/>
  </Route>
);

export default routes;
