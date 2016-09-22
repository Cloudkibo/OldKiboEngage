import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import LoginContainer from './container/Auth/Login';
import ForgotPassword from './container/Auth/ForgotPassword';

import SignupContainer from './container/Auth/Signup';
import Verification from './container/Auth/Verification';
import VerificationFailure from './container/Auth/VerificationFailure';

import Intro from './container/Intro';
import Dashboard from './container/Dashboard';
import Reports from './container/HighCharts/HighCharts'
import Teams from './container/Teams/Teams';
import Agents from './container/Agents/Agents';
import Chat from './container/Chat/Chat';
import ClientChat from './container/Chat/ClientChat';
import CompanySettings from './container/CompanySettings/CompanySettings';
import TeamDetailView from './container/Teams/TeamDetailView';
import TeamEditView from './container/Teams/TeamEditView';
import AgentEditView from './container/Agents/AgentEditView';
import MessageChannelCreate from './container/MessageChannel/messageChannelCreate'
import CreateGroup from './container/Groups/CreateGroup'

import Channel from './container/MessageChannel/Channels'
import ChannelEditView from './container/MessageChannel/ChannelEditView'
import JoinCompany from './container/Agents/JoinCompany'
import JoinCompanyFailure from './container/Agents/JoinCompanyFailure'
import ResetPassword from './container/Auth/ResetPassword'
import ResetPasswordFailure from './container/Auth/ResetPasswordFailure'
import CannedResponseCreate from './container/CannedResponse/CannedResponseCreate'
import CannedResponses from './container/CannedResponse/CannedResponses'
import ResponseEditView from './container/CannedResponse/ResponseEditView'
import SessionDetailView from './container/ChatSessions/SessionDetailView'
import JoinPage from './container/Agents/JoinPage'
import NotFound from './container/NotFound'
import auth from './services/auth';
import AddNotification from './container/Notifications/AddNotification'
import Notifications from './container/Notifications/Notifications'
import NotificationView from './container/Notifications/NotificationView'
import EditNotification from './container/Notifications/EditNotification'
import MyTeams from './container/MyProfile/MyTeams'
import MyProfile from './container/MyProfile/MyProfile'
import MyPickedSessions from './container/MyProfile/MyPickedSessions'
import AssignedSessions from './container/ChatSessions/AssignedSessions'
import SessionSummary from './container/ChatSessions/SessionSummary'

import ResolvedSessions from './container/ChatSessions/ResolvedSessions'

import NewSessions from './container/ChatSessions/NewSessions'

import ChangeAvatar from './container/MyProfile/ChangeAvatar'
import ChangePassword from './container/MyProfile/ChangePassword'

import Customers from './container/CustomerDirectory/Customers'
import AddCustomer from './container/CustomerDirectory/AddCustomer'
import EmailCustomer from './container/CustomerDirectory/EmailCustomer'
import Router from 'react-router';
import { browserHistory } from 'react-router'
import NotVerified from './container/NotVerified'
import RescheduleResolvedSessions from './container/ChatSessions/RescheduleResolvedSessions'
import RescheduleAbandonedSessions from './container/ChatSessions/RescheduleAbandonedSessions'
import io from 'socket.io-client'
let socket = io('')

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
   <Route path="/" component={App} socket = {socket}>
    <IndexRoute component={Intro} onEnter={redirectAuthUsers} />
    <Route path="/login" component={LoginContainer} onEnter={redirectAuthUsers} />
    <Route path="/signup" component={SignupContainer} onEnter={redirectAuthUsers} />
    <Route path="/forgotpassword" component={ForgotPassword} />
    <Route path="/notverified" component={NotVerified}  onEnter={requireAuth}/>
  
    <Route path="joincompany/:id" component={JoinCompany}/>
    <Route path="/join" component={JoinPage}/>
    <Route path="/joincompanyfailure" component={JoinCompanyFailure} />
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} socket = {socket}/>
    <Route path="/teams" component={Teams} onEnter={requireAuth} />
    <Route path="/agents" component={Agents} onEnter={requireAuth} />
    
    <Route path="/team/:id" component={TeamDetailView}  onEnter={requireAuth}/>
    <Route path="/editteam/:id" component={TeamEditView}  onEnter={requireAuth}/>
    <Route path="/editagent/:id" component={AgentEditView}  onEnter={requireAuth}/>
    <Route path="/createmessagechannel" component={MessageChannelCreate}  onEnter={requireAuth}/>
    <Route path="/creategroup" component={CreateGroup}  onEnter={requireAuth}/>
    
    <Route path="/messagechannels" component={Channel}  onEnter={requireAuth}/>
    <Route path="/editchannel/:id" component={ChannelEditView}  onEnter={requireAuth}/>


     <Route path="/createcannedresponse" component={CannedResponseCreate}  onEnter={requireAuth}/>
    <Route path="/cannedresponses" component={CannedResponses}  onEnter={requireAuth}/>
    <Route path="/editresponse/:id" component={ResponseEditView}  onEnter={requireAuth}/>
    <Route path="/verification/:id" component={Verification}/>
    <Route path="/verificationfailure" component={VerificationFailure} />
   
    <Route path="/resetpassword/:id" component={ResetPassword}/>
    <Route path="/resetpasswordfailure" component={ResetPasswordFailure}/>
    <Route path="/changepassword" component={ChangePassword} onEnter={requireAuth}/>
    <Route path="/chat" component={Chat} onEnter={requireAuth}  socket = {socket}/>
    <Route path="/clientchat" component={ClientChat}  socket = {socket}/>
    
    <Route path="/notifications" component={Notifications} onEnter={requireAuth} />
    <Route path="/addnotification" component={AddNotification} onEnter={requireAuth}  socket = {socket} />
    <Route path="/notification/:id" component={NotificationView}  onEnter={requireAuth}/>
    <Route path="/editnotification/:id" component={EditNotification}  onEnter={requireAuth}/>
     <Route path="/customers" component={Customers} onEnter={requireAuth} />
     <Route path="/livehelp/:id/:pathname(/:requestid)" component={AddCustomer} socket={socket}/> 
     <Route path="/sendemail/:id" component={EmailCustomer}  onEnter={requireAuth}/>
     <Route path="/myteams" component={MyTeams}  onEnter={requireAuth}/>
     <Route path="/myprofile" component={MyProfile}  onEnter={requireAuth}/>
     <Route path="/companyprofile" component={CompanySettings}  onEnter={requireAuth}/>
     <Route path="/changeavatar" component={ChangeAvatar}  onEnter={requireAuth}/>
     <Route path="/mypickedchatsessions"  component={MyPickedSessions}  onEnter={requireAuth}/>
     <Route path="/assignedchatsessions"  component={AssignedSessions}  socket={socket} onEnter={requireAuth}/>
     <Route path="/newchatsessions"  component={NewSessions}  socket={socket} onEnter={requireAuth}/>
     <Route path="/resolvedchatsessions"  component={ResolvedSessions}  socket={socket} onEnter={requireAuth}/>
     <Route path="/summarychatsessions"  component={SessionSummary}  socket={socket} onEnter={requireAuth}/>
     <Route path="/reports"  component={Reports}  onEnter={requireAuth}/>
     
     <Route path="/chatsessionview/:id"  component={SessionDetailView} onEnter={requireAuth}/>
     <Route path="/rescheduleresolvedsession/:id/:name/:email"  component={RescheduleResolvedSessions} onEnter={requireAuth}/>
     <Route path="/rescheduleabandonedsession/:id/:name/:email"  component={RescheduleAbandonedSessions} onEnter={requireAuth}/>
     <Route path="*" component={NotFound} />
  </Route>
 
);
export default routes;
