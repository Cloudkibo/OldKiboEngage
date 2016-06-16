import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import LoginContainer from './container/Auth/Login';
import SignupContainer from './container/Auth/Signup';
import Verification from './container/Auth/Verification';
import VerificationFailure from './container/Auth/VerificationFailure';

import Intro from './container/Intro';
import Dashboard from './container/Dashboard';
import Groups from './container/Groups/Groups';
import Agents from './container/Agents/Agents';
import Chat from './container/Chat/Chat';
import ClientChat from './container/Chat/ClientChat';

import GroupDetailView from './container/Groups/GroupDetailView';
import GroupEditView from './container/Groups/GroupEditView';
import AgentEditView from './container/Agents/AgentEditView';
import MessageChannelCreate from './container/MessageChannel/messageChannelCreate'
import Channel from './container/MessageChannel/Channels'
import ChannelEditView from './container/MessageChannel/ChannelEditView'
import JoinCompany from './container/Agents/JoinCompany'
import JoinCompanyFailure from './container/Agents/JoinCompanyFailure'


import CannedResponseCreate from './container/CannedResponse/CannedResponseCreate'
import CannedResponses from './container/CannedResponse/CannedResponses'
import ResponseEditView from './container/CannedResponse/ResponseEditView'
import JoinPage from './container/Agents/JoinPage'
import NotFound from './container/NotFound'
import auth from './services/auth';

import AddNotification from './container/Notifications/AddNotification'
import Notifications from './container/Notifications/Notifications'
import NotificationView from './container/Notifications/NotificationView'
import Customers from './container/CustomerDirectory/Customers'

import Router from 'react-router';
import { browserHistory } from 'react-router'


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
    <Route path="joincompany/:id" component={JoinCompany}/>
     <Route path="/join" component={JoinPage}/>
     <Route path="/joincompanyfailure" component={JoinCompanyFailure} />
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
    <Route path="/groups" component={Groups} onEnter={requireAuth} />
    <Route path="/agents" component={Agents} onEnter={requireAuth} />
    
    <Route path="/group/:id" component={GroupDetailView}  onEnter={requireAuth}/>
    <Route path="/editgroup/:id" component={GroupEditView}  onEnter={requireAuth}/>
    <Route path="/editagent/:id" component={AgentEditView}  onEnter={requireAuth}/>
    <Route path="/createmessagechannel" component={MessageChannelCreate}  onEnter={requireAuth}/>
    <Route path="/messagechannels" component={Channel}  onEnter={requireAuth}/>
    <Route path="/editchannel/:id" component={ChannelEditView}  onEnter={requireAuth}/>


     <Route path="/createcannedresponse" component={CannedResponseCreate}  onEnter={requireAuth}/>
    <Route path="/cannedresponses" component={CannedResponses}  onEnter={requireAuth}/>
    <Route path="/editresponse/:id" component={ResponseEditView}  onEnter={requireAuth}/>
    <Route path="/verification/:id" component={Verification}/>
    <Route path="/verificationfailure" component={VerificationFailure} />
    <Route path="/chat" component={Chat} onEnter={requireAuth} />
    <Route path="/clientchat" component={ClientChat}/>
    
    <Route path="/notifications" component={Notifications} onEnter={requireAuth} />
    <Route path="/addnotification" component={AddNotification} onEnter={requireAuth} />
    <Route path="/notification/:id" component={NotificationView}  onEnter={requireAuth}/>
    
     <Route path="/customers" component={Customers} onEnter={requireAuth} />
   
    <Route path="*" component={NotFound} />
  </Route>
 
);
export default routes;
