import io from 'socket.io-client';

import {setSocketStatus, setUserJoinedRoom} from './redux/actions/socketio.actions';
import {
  setjoinedState,
  updateCustomerList,
  updatefbsessionlist,
  previousChat,
  getassignedsessionsfromsocket,
  getnewsessionsfromsocket,
  getresolvedsessionsfromsocket,
  setsocketid,
  getsessionsfromsocket,
  updateAgentList,
  getchatsfromsocket,
  add_socket_fb_message,
  updatechatsessionstatus,
  update_userchats_list,
  updatechatstatus,
  updateChatList,
  removeDuplicates,
  removeDuplicatesWebChat,
  update_mobileuserchats_list

} from './redux/actions/actions';
import {notify} from './services/notify';
import auth from './services/auth';
import {printlogs} from './services/clientlogging';

const socket = io('');
let store;

function showSession(customer){
    console.log('showSession called');
    console.log(customer);
    var is_agent_in_team = false;
   
    if(store.getState().dashboard.fbteams)
    {
    var get_teams_assigned_to_page = store.getState().dashboard.fbteams.filter((c) => c.pageid._id == customer.pageid._id);
    for(var i=0;i<get_teams_assigned_to_page.length;i++){
      for(var j=0;j<store.getState().dashboard.teamagents.length;j++){
        if(get_teams_assigned_to_page[i].teamid._id == store.getState().dashboard.teamagents[j].groupid._id && store.getState().dashboard.teamagents[j].agentid._id == store.getState().dashboard.userdetails._id ){
          is_agent_in_team = true;
          break;

        }
      }
      if(is_agent_in_team == true){
        break;
      }

    }
  }
   return is_agent_in_team;
  }


  function showSessionforMessage(senderid,recipientid){
    console.log('showSessionforMessage called');
    var is_agent_in_team = false;
   
    if(store.getState().dashboard.fbteams)
    {
    var get_teams_assigned_to_page = store.getState().dashboard.fbteams.filter((c) => c.pageid._id == senderid || c.pageid._id == recipientid);
    for(var i=0;i<get_teams_assigned_to_page.length;i++){
      for(var j=0;j<store.getState().dashboard.teamagents.length;j++){
        if(get_teams_assigned_to_page[i].teamid._id == store.getState().dashboard.teamagents[j].groupid._id && store.getState().dashboard.teamagents[j].agentid._id == store.getState().dashboard.userdetails._id ){
          is_agent_in_team = true;
          break;

        }
      }
      if(is_agent_in_team == true){
        break;
      }

    }
  }
   return is_agent_in_team;
  }

   function showSession_for_web(departmentid){
     var is_agent_in_team = false;
   
    if(store.getState().dashboard.deptteams)
    {
    var get_teams_assigned_to_group = store.getState().dashboard.deptteams.filter((c) => c.deptid._id == departmentid);
    for(var i=0;i<get_teams_assigned_to_group.length;i++){
      for(var j=0;j<store.getState().dashboard.teamagents.length;j++){
        if(get_teams_assigned_to_group[i].teamid._id == store.getState().dashboard.teamagents[j].groupid._id && store.getState().dashboard.teamagents[j].agentid._id == store.getState().dashboard.userdetails._id ){
          is_agent_in_team = true;
          break;

        }
      }
      if(is_agent_in_team == true){
        break;
      }

    }
  }
   return is_agent_in_team;
  }

export function initiateSocket(storeObj) {
  store = storeObj;
  socket.connect();
}

socket.on('customer_joined', (data,currentsession) => {
  console.log('customer_joined');
  console.log(showSession_for_web(currentsession.departmentid));
  console.log(currentsession);
  if(showSession_for_web(currentsession.departmentid) == true){
  notify('A customer has joined.');
}
  console.log(data.length);
  store.dispatch(getsessionsfromsocket(data, store.getState().dashboard.customerchat_selected));
});



socket.on('send:fbcustomer', (data) => {
  // we have to send notification to Agent only if the session is in FbPage to which the team (which agent has joined) is assigned//
  if(showSession(data) == true){
     notify('facebook customer joined');
 
  }
  if (store.getState().dashboard.fbsessions) {
    store.dispatch(updateCustomerList(data,
      store.getState().dashboard.fbsessions,
      store.getState().dashboard.fbsessionSelected));
  }
});

socket.on('send:fbmessage', (data) => {

  // printlogs('log','new fb message is received');
  // printlogs('log',data)
  // printlogs('log',this.props.fbsessionSelected);
   console.log(window.location.host);
   if(showSessionforMessage(data.senderid,data.recipientid) == true && window.location.origin != "https://kiboengage.kibosupport.com"){
     notify('facebook customer sends a message');
 
  }
  if (store.getState().dashboard.fbsessionSelected && store.getState().dashboard.fbchats) {
    if (!store.getState().dashboard.fbsessionSelected.user_id) {
      data.seen = false;
    }
    else if (store.getState().dashboard.fbsessionSelected.user_id && data.senderid != store.getState().dashboard.fbsessionSelected.user_id.user_id) {

      data.seen = false;
    }
    else {
      data.seen = true;
    }

    if(location.pathname !== '/fbchat') {
      data.seen = false;
    }

    store.dispatch(add_socket_fb_message(data, store.getState().dashboard.fbchats, store.getState().dashboard.fbsessionSelected.user_id.user_id, store.getState().dashboard.fbsessions, store.getState().dashboard.sessionsortorder));
  }
  //  this.forceUpdate();
});
socket.on('connecttocall',(data) =>{
   if(confirm("Other person is calling you to a call. Confirm to join."))
        //window.location.href = data.url;
        var win = window.open(data.url, '_blank');
       // win.focus();

});
socket.on('updateFBsessions', (data) => {
  if (data.status === 'assigned') {
    notify(`${data.username } of Facebook Page ${data.pageTitle} has been assigned to ${data.agentname}`);
  } else {
    notify(`${data.username} of Facebook Page ${data.pageTitle} has been resolved by ${data.agentname}`);
  }
  console.log('inside UpdateFBSession Socket Message ' + data);
  store.dispatch(updatefbsessionlist(data,
    store.getState().dashboard.fbsessions,
    store.getState().dashboard.fbsessionSelected,
    store.getState().dashboard.fbchats,
    store.getState().dashboard.fbchatSelected));
});


socket.on('informAgent', (message) => {
  store.dispatch(updatechatsessionstatus(store.getState().dashboard.customerchat, store.getState().dashboard.customerchat_selected, store.getState().dashboard.userdetails, message));
  store.dispatch(previousChat(message, store.getState().dashboard.chatlist));
});

// todo work with zarmeen
socket.on('send:message', (message) => {
   console.log('send:message called');
   console.log(message);
   console.log(window.location);
    if(showSession_for_web(message.departmentid) == true && window.location.origin != "https://kiboengage.kibosupport.com"){
     notify('customer sends a message');
 
  }
  if (store.getState().dashboard.customerchat_selected) {
    if ((store.getState().dashboard.customerchat_selected.request_id != message.request_id) && message.status && message.status == 'sent' && message.fromMobile && message.fromMobile == 'yes') {
      printlogs('log','mobile userchat is not selected, message received');
      const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
       ***/
      var messages = [];
      messages.push({'uniqueid': message.uniqueid, 'request_id': message.request_id, 'status': 'delivered'});
      if (messages.length > 0) {
        //   alert('New message arrived chat!');
        // highlight chat box

       // store.dispatch(updatechatstatus(messages, message.from, usertoken, store.getState().dashboard.mobileuserchat)); //actions
        store.dispatch(updateChatList(message, store.getState().dashboard.new_message_arrived_rid)); //actions
       // message.status = 'delivered';

      }
    }


    else if ((store.getState().dashboard.customerchat_selected.request_id == message.request_id) && message.status && message.status == 'sent' && message.fromMobile && message.fromMobile == 'yes') {
      printlogs('log','mobile userchat is  selected, message received');
      const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
       ***/
      var messages = [];
      messages.push({'uniqueid': message.uniqueid, 'request_id': message.request_id, 'status': 'delivered'});
      if (messages.length > 0) {
        //   alert('New message arrived chat!');
        // highlight chat box

       // store.dispatch(updatechatstatus(messages, message.from, usertoken, store.getState().dashboard.mobileuserchat)); //actions
        store.dispatch(update_mobileuserchats_list(message,store.getState().dashboard.mobileuserchat));
      
     //   store.dispatch(updateChatList(message, store.getState().dashboard.new_message_arrived_rid)); //actions
        message.status = 'delivered';

      }
    }

    else if ((store.getState().dashboard.customerchat_selected.request_id != message.request_id) && message.fromMobile == 'no') {
      // alert(' i m called2')
      printlogs('log', "Chat Not Selected");
      //this.props.userchats.push(message);
      store.dispatch(update_userchats_list(message,store.getState().dashboard.userchats));
      store.dispatch(updateChatList(message, store.getState().dashboard.new_message_arrived_rid));
      //this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');
     // this.forceUpdate();
    }
    else if ((store.getState().dashboard.customerchat_selected.request_id == message.request_id) && message.fromMobile == 'no') {
      // alert(' i m called2')
      printlogs('log', "Chat Selected");
      //this.props.userchats.push(message);
       store.dispatch(update_userchats_list(message,store.getState().dashboard.userchats));
       store.dispatch(updateChatList(message,store.getState().dashboard.new_message_arrived_rid,store.getState().dashboard.customerchat_selected.request_id));
       store.dispatch(removeDuplicatesWebChat(store.getState().userchats,'uniqueid'));


      //this.props.updateChatList(message,this.props.new_message_arrived_rid,this.props.customerchat_selected.request_id);
      //this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');
      //this.forceUpdate();
    }


  }
  else if (!store.getState().dashboard.customerchat_selected && message.fromMobile == 'yes' && message.status && message.status == 'sent') {
    const usertoken = auth.getToken();
    /*** call api to update status field of chat message received from mobile to 'delivered'
     ***/
    var messages = [];
    messages.push({'uniqueid': message.uniqueid, 'request_id': message.request_id, 'status': 'delivered'});
    if (messages.length > 0) {
      //   alert('New message arrived!');
      store.dispatch(updatechatstatus(messages, message.from, usertoken, store.getState().dashboard.mobileuserchat));
      store.dispatch(updateChatList(message, store.getState().dashboard.new_message_arrived_rid));
      message.status = 'delivered';
    }

    //this.props.mobileuserchat.push(message);
    store.dispatch(update_userchats_list(message,store.getState().dashboard.userchats));
    store.dispatch(removeDuplicates(store.getState().dashboard.mobileuserchat,'uniqueid'));

 //   this.props.userchats.push(message);
 //   this.props.removeDuplicates(this.props.mobileuserchat, 'uniqueid');
  }

  else if (!store.getState().dashboard.customerchat_selected && message.fromMobile == 'no') {
    store.dispatch(update_userchats_list(message,store.getState().dashboard.userchats));
    store.dispatch(updateChatList(message, store.getState().dashboard.new_message_arrived_rid));

   // this.props.userchats.push(message);
   // this.props.updateChatList(message, this.props.new_message_arrived_rid);
    // this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');

  }
 // this.forceUpdate();
});

socket.on('agentjoined', () => {
  console.log('user joined room');
  store.dispatch(setUserJoinedRoom(true));
  store.dispatch(setjoinedState('joined'));
});

socket.on('returnCustomerSessionsList', (data) => {
  console.log(data);
  console.log('customer left')
  console.log(data.length);

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
  if (disconnected === true) {
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


