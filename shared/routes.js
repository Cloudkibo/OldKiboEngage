import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import LoginContainer from './container/Auth/Login';
import SignupContainer from './container/Auth/Signup';
import Intro from './container/Intro';
import Dashboard from './container/Dashboard';
import Groups from './container/Groups/Groups';
import Agents from './container/Agents/Agents';

import GroupDetailView from './container/Groups/GroupDetailView';
import GroupEditView from './container/Groups/GroupEditView';
import AgentEditView from './container/Agents/AgentEditView';
import MessageChannelCreate from './container/MessageChannel/messageChannelCreate'
import Channel from './container/MessageChannel/Channels'

import NotFound from './container/NotFound'
import auth from './services/auth';
import RouterContainer from './services/RouterContainer';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    console.log('you are not logged in.');
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectAuthUsers(nextState, replace) {
  if (auth.loggedIn()) {
    console.log('you are logged in. You cant go here.');
    replace({
      pathname: '/dashboard',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Intro} onEnter={redirectAuthUsers} />
    <Route path="/login" component={LoginContainer} onEnter={redirectAuthUsers} />
    <Route path="/signup" component={SignupContainer} onEnter={redirectAuthUsers} />
   
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
    <Route path="/groups" component={Groups} onEnter={requireAuth} />
    <Route path="/agents" component={Agents} onEnter={requireAuth} />
    
    <Route path="/group/:id" component={GroupDetailView}  onEnter={requireAuth}/>
    <Route path="/editgroup/:id" component={GroupEditView}  onEnter={requireAuth}/>
    <Route path="/editagent/:id" component={AgentEditView}  onEnter={requireAuth}/>
    <Route path="/createmessagechannel" component={MessageChannelCreate}  onEnter={requireAuth}/>
    <Route path="/messagechannels" component={Channel}  onEnter={requireAuth}/>

    <Route path="*" component={NotFound} />
  </Route>
);
RouterContainer.set(routes);
export default routes;
