import io from 'socket.io-client';

import { setSocketStatus, setUserJoinedRoom } from './redux/actions/socketio.actions';
import { setjoinedState, updateCustomerList, updatefbsessionlist,
getassignedsessionsfromsocket, getnewsessionsfromsocket, getresolvedsessionsfromsocket } from './redux/actions/actions';
import { notify } from './services/notify';

const socket = io('');
let store;

export function initiateSocket(storeObj) {
  store = storeObj;
  socket.connect();
}

socket.on('customer_joined', (data) => {
  notify('A customer has joined.');
});

socket.on('send:fbcustomer', (data) => {
  notify('facebook customer joined');
  if (store.getState().dashboard.fbsessions) {
    store.dispatch(updateCustomerList(data,
      store.getState().dashboard.fbsessions,
      store.getState().dashboard.fbsessionSelected));
  }
});

socket.on('updateFBsessions', (data) => {
  if (data.status === 'assigned') {
    notify(`${data.username } of Facebook Page ${data.pageTitle} has been assigned to ${data.agentname}`);
  } else {
    notify(`${data.username} of Facebook Page ${data.pageTitle} has been resolved by ${data.agentname}`);
  }
  store.dispatch(updatefbsessionlist(data,
    store.getState().dashboard.fbsessions,
    store.getState().dashboard.fbsessionSelected,
    store.getState().dashboard.fbchats,
    store.getState().dashboard.fbchatSelected));
});

socket.on('agentjoined', () => {
  console.log('user joined room');
  store.dispatch(setUserJoinedRoom(true));
  store.dispatch(setjoinedState('joined'));
});

socket.on('returnCustomerSessionsList', (data) => {
  store.dispatch(getassignedsessionsfromsocket(data, store.getState().dashboard.assignedsessions));
});

socket.on('customer_left', (data) => {
  store.dispatch(getnewsessionsfromsocket(data, store.getState().dashboard.newsessions));
});

socket.on('returnCustomerSessionsList', (data) => {
  store.dispatch(getresolvedsessionsfromsocket(data, store.getState().dashboard.resolvedsessions));
});

socket.on('connect', () => {
  console.log('connected to socket server called from socket.js');
  store.dispatch(setSocketStatus(true));
});

socket.on('disconnect', () => {
  console.log('disconnected from socket server called from socket.js');
  store.dispatch(setSocketStatus(false));
});

socket.on('verified', () => {
  location.reload();
});

socket.on('syncdata', () => {
  socket.emit('getOnlineAgentList');
  socket.emit('getuserchats', store.getState().dashboard.userdetails.uniqueid);
});

export function joinMeetingForAgent() {
  console.log('going to join room');
  socket.emit('create or join meeting for agent', {
    room: store.getState().dashboard.userdetails.uniqueid,
    agentEmail: store.getState().dashboard.userdetails.email,
    agentName: store.getState().dashboard.userdetails.firstname + ' ' + store.getState().dashboard.userdetails.lastname,
    agentId: store.getState().dashboard.userdetails._id,
  });
}


