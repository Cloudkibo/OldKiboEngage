import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import LoginContainer from './container/Auth/Login';
import SignupContainer from './container/Auth/Signup';
import Intro from './container/Intro';
import Dashboard from './container/Dashboard';
import auth from './services/auth';
import RouterContainer from './services/RouterContainer';
function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    console.log('you are not logged in.')
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Intro} />
    <Route path="/login" component={LoginContainer}/>
    <Route path="/signup" component={SignupContainer}/>
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
  </Route>
);
RouterContainer.set(routes);
export default routes;
