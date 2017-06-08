import io from 'socket.io-client';

import { setSocketStatus, setUserJoinedRoom } from './redux/actions/socketio.actions';
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
});

socket.on('updateFBsessions', (data) => {
  if (data.status === 'assigned') {
    notify(`${data.username } of Facebook Page ${data.pageTitle} has been assigned to ${data.agentname}`);
  } else {
    notify(`${data.username} of Facebook Page ${data.pageTitle} has been resolved by ${data.agentname}`);
  }
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

export function sendSocketMessage(type, data) {
  // console.log(`socket message called: ${JSON.stringify(data)}`);
  // socket.emit('platform_room_message', {
  //   phone: store.getState().connectInfo.number,
  //   from_connection_id: store.getState().connectInfo.id,
  //   to_connection_id: store.getState().connectInfo.mobileId,
  //   type,
  //   data,
  // });
}
