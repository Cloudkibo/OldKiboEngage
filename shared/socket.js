import io from 'socket.io-client';

import {setSocketStatus, setUserJoinedRoom} from './redux/actions/socketio.actions';
import {
  setjoinedState, updateCustomerList, updatefbsessionlist, previousChat,
  getassignedsessionsfromsocket, getnewsessionsfromsocket, getresolvedsessionsfromsocket,
  setsocketid, getsessionsfromsocket, updateAgentList, getchatsfromsocket,
} from './redux/actions/actions';
import {notify} from './services/notify';

const socket = io('');
let store;

export function initiateSocket(storeObj) {
  store = storeObj;
  socket.connect();
}

socket.on('customer_joined', (data) => {
  notify('A customer has joined.');
  store.dispatch(getsessionsfromsocket(data, store.getState().dashboard.customerchat_selected));
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
  console.log(data);
  // todo discuss this very important with Zarmeen
  store.dispatch(getsessionsfromsocket(data, store.getState().dashboard.customerchat_selected));
  store.dispatch(getassignedsessionsfromsocket(data, store.getState().dashboard.assignedsessions));
  store.dispatch(getresolvedsessionsfromsocket(data, store.getState().dashboard.resolvedsessions));
});

socket.on('customer_left', (data) => {
  store.dispatch(getnewsessionsfromsocket(data, store.getState().dashboard.newsessions));
});

socket.on('send:fbcustomer', (data) => {
  socket.emit('logClient', {msg: 'new fb customer is received ', data: data});
  if (store.getState().dashboard.fbsessions) {
    store.dispatch(updateCustomerList(data, store.getState().dashboard.fbsessions, store.getState().dashboard.fbsessionSelected));
  }
});

socket.on('getmysocketid', (socketid) => {
  setsocketid(socketid);
});

socket.on('updateOnlineAgentList', (data) => {
  store.dispatch(updateAgentList(data));
});

socket.on('returnUserChat', (data) => {
  if (store.getState().dashboard.userchats) {
    store.dispatch(getchatsfromsocket(store.getState().dashboard.userchats, data));
  }
  else {
    store.dispatch(getchatsfromsocket([], data))
  }
  store.dispatch(previousChat(data, store.getState().dashboard.chatlist));
});

let disconnected = false;

socket.on('connect', () => {
  console.log('connected to socket server called from socket.js');
  store.dispatch(setSocketStatus(true));
  if(disconnected === true){
    location.reload();
  }
});

socket.on('disconnect', () => {
  console.log('disconnected from socket server called from socket.js');
  store.dispatch(setSocketStatus(false));
  disconnected = true;
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

export function sendNotification(message) {
  socket.emit('send:notification', message);
}

export function initiateChatComponent() {
  socket.emit('getOnlineAgentList');
  socket.emit('returnMySocketId');
  // socket.emit('getCustomerSessionsList');
}

export function updateSessionStatusFb(data) {
  socket.emit('updatesessionstatusFB', data);
}

export function broadCastFb(data) {
  socket.emit('broadcast_fbmessage', data);
}

export function returnSocket() {
  return socket;
}
