/**
 * Socket.io configuration
 */

'use strict';
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('KiboEngage','Endpoint=sb://kiboengagepushns.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=gDirYG/+a/dN5Md5rOXMX6QFfiFnX0Dg3kabUNCjIy0=');

function sendPushNotification(tagname, payload){
  //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
  var iOSMessage = {
    alert : payload.msg,
    sound : 'UILocalNotificationDefaultSoundName',
    badge : payload.badge,
    payload : payload
  };
  var androidMessage = {
    to : tagname,
    priority : "high",
    data : {
      message : payload
    }
  }
  notificationHubService.gcm.send(tagname, androidMessage, function(error){
    if(!error){
      logger.serverLog('info', 'Azure push notification sent to Android using GCM Module, client number : '+ tagname);
    } else {
      logger.serverLog('info', 'Azure push notification error : '+ JSON.stringify(error));
    }
  });
  notificationHubService.apns.send(tagname, iOSMessage, function(error){
    if(!error){
      logger.serverLog('info', 'Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
    } else {
      logger.serverLog('info', 'Azure push notification error : '+ JSON.stringify(error));
    }
  });
}



var onlineAgents = [];
var onlineWebClientsSession = []; //array to hold customer sessions who are online.This is for our WebClients

var userchats = [];//array to hold all  chat msgs

// When the user disconnects.. perform this
function onDisconnect(io2, socket) {
  console.log('calling onDisconnect  :' + socket.id);
  //Remove agent from onlineAgents array
  for(var j = 0;j<onlineAgents.length ;j++){
    if(onlineAgents[j].socketid == socket.id){
      console.log('Remove agent with  email : ' + onlineAgents[j].email);
      var room = onlineAgents[j].room;
      onlineAgents.splice(j,1);
      console.log(onlineAgents);
      socket.broadcast.to(room).emit('updateOnlineAgentList', onlineAgents);
   
      break;
    }

  }

  //remove session also
  var session_remove = false;
  var room
  for(var j = 0;j< onlineWebClientsSession.length;j++){
    if(onlineWebClientsSession[j].socketid == socket.id){
       console.log('Remove session,customer went offline');
      room = onlineWebClientsSession[j].room;
      onlineWebClientsSession.splice(j,1);
      console.log(onlineWebClientsSession);
      session_remove = true
      break;
    }
  }

  if(session_remove == true){
   var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].room == room){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }

  console.log('customers online : ' + customer_in_company_room.length);
  //ask clients to update their session list
   socket.broadcast.to(room).emit('returnCustomerSessionsList',customer_in_company_room);
   session_remove = false;
  }
}
// When the user connects.. perform this
function onConnect(io2, socket) {
 console.log(socket.id + ' connected');

  socket.on('logClient', function(data){
    //logger.clientLog(data.level, "Client side log: "+ data.data);
  });


// broadcast a user's message to other users
  socket.on('send:message', function (data) {
    
    /*** Add the logic here to send message as a push notification using customerid as a tag name for moble customers
    ***/

    console.log(data);
    userchats.push(data);

    if(data.socketid){
            console.log('sending point to point message');

            io2.to(data.socketid).emit('send:message',{
            to: data.to,
            socketid:data.socketid,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            msg: data.msg,
            time:data.time,
            uniqueid : data.uniqueid,
            type : data.type,
            request_id :data.request_id,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen



          
          });
    }


    else if(data.toagent){
            console.log('sending point to point message to Agent');

            io2.to(data.toagent).emit('send:message',{
            to: data.to,
            toagent:data.toagent,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            msg: data.msg,
            time:data.time,
            request_id : data.request_id,
            type : data.type,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen
          });
    }
    else
    {
          socket.broadcast.to(data.companyid).emit('send:message', {
            to: data.to,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            msg: data.msg,
            uniqueid : data.uniqueid,
            time:data.time,
            type : data.type,
            request_id :data.request_id,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen


          });
    }
  });




 socket.on('informAgent', function (data) {
    console.log(data);
    userchats.push(data);
    io2.to(data.agentsocket).emit('send:message',{
            to: data.to,
            assignedagentname : data.assignedagentname,
            socketid:data.socketid,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            uniqueid: data.uniqueid,
            msg: data.msg,
            time:data.time,
            type : data.type,
            request_id :data.request_id,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen



          
          });
    
    
  });



socket.on('send:messageToAgent', function (data) {
    console.log('sending a hello message to all agents');
    console.log(data);
    userchats.push(data);

    if(data.toagent){
            console.log('sending point to point message to Agent');

            io2.to(data.toagent).emit('send:message',{
            to: data.to,
            toagent:data.toagent,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            uniqueid:data.uniqueid,
            msg: data.msg,
            time:data.time,
            request_id : data.request_id,
            type : data.type,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen
          });
    }
    else
    {
          socket.broadcast.to(data.companyid).emit('send:message', {
            to: data.to,
            from : data.from,
            visitoremail:data.visitoremail,
            datetime:data.datetime,
            msg: data.msg,
            time:data.time,
            uniqueid:data.uniqueid,
            
            type : data.type,
            request_id :data.request_id,
            messagechannel:data.messagechannel,
            companyid:data.companyid,
            is_seen:data.is_seen


          });
    }
  });

socket.on('getuserchats',function(room){
  //return userchats currently happening in room
  var roomchats =[];
  for(var c = 0;c<userchats.length;c++){
    if(c.companyid == room)
    {
      roomchats.push(userchats[c]);

    }
  }

  console.log('return userchats : ' + roomchats.length);
  socket.emit('returnUserChat',roomchats);  
});

// broadcast a notification to mobile client
  socket.on('send:notification', function (data) {
    console.log(data);
    console.log('sending notification to mobile client');
    socket.broadcast.emit('send:notification', {
            sender: data.sender,
            title:data.title,
            msg: data.msg,
            time:data.time,
            
          });
    
  });


  socket.on('send:agentsocket', function (data) {
    console.log('sending agent socket to customer');
    console.log(data);
    io2.to(data.socketid).emit('send:getAgent',{
           data:data       
          });
    } 
  );

 socket.on('updatesessionstatus',function(data){
  console.log('updatesessionstatus is called');
  console.log(data);
  for(var i =0 ;i< onlineWebClientsSession.length ;i++){
    if(onlineWebClientsSession[i].request_id == data.request_id){
      console.log('updating session status :');
      onlineWebClientsSession[i].status = data.status;
      onlineWebClientsSession[i].agent_ids.push(data.agentid);
      console.log(onlineWebClientsSession[i]);
      break;
    }
  }

 

  var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].room == data.room){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }


  console.log('customers online : ' + customer_in_company_room.length);
  //ask clients to update their session list
   socket.broadcast.to(data.room).emit('returnCustomerSessionsList',customer_in_company_room);
 }); 


socket.on('updatesessionchannel',function(data){
  console.log('updatesessionchannel is called');
  console.log(data);
  for(var i =0 ;i< onlineWebClientsSession.length ;i++){
    if(onlineWebClientsSession[i].request_id == data.request_id){
      console.log('updating session channel :');
     
      onlineWebClientsSession[i].messagechannel.push(data.channelid);
      console.log(onlineWebClientsSession[i]);
      break;
    }
  }

 

  var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].room == data.room){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }


  console.log('customers online : ' + customer_in_company_room.length);
  //ask clients to update their session list
   socket.broadcast.to(data.room).emit('returnCustomerSessionsList',customer_in_company_room);
 }); 
  
// get online agents list
socket.on('getOnlineAgentList',function() {
    console.log('getOnlineAgentList is called by :');
    socket.emit('updateOnlineAgentList',onlineAgents);
  });

  socket.on('message', function (message) {
    //log('Got message:', message);
    io2.to(message.to).emit('message', message);
  });


  socket.on('impicked', function (room) {

    socket.broadcast.to(room.room).emit('picked', room);
    socket.leave(room.room);
    socket.emit('picked', room);

  });

  socket.on('ifinishedcall', function (room) {

    socket.broadcast.to(room.room).emit('callfinished', room);

  });

  socket.on('leave', function (room) {

    // TODO use API here to store this data into database
/*
    var visitorcalls = require('./../api/visitorcalls/visitorcalls.model.js');

    visitorcalls.findOne({request_id : room.request_id}, function(err, gotVisitorCallData){

      if(gotVisitorCallData == null) return ;

      gotVisitorCallData.status = 'abandoned';
      gotVisitorCallData.abandonedtime = room.abandonedtime;

      gotVisitorCallData.save(function(err){
        if(err) console.log(err);
      });
    });
*/
    socket.broadcast.to(room.room).emit('left', room);
    socket.leave(room.room);
    socket.emit('left', room);

  });

  socket.on('join meeting', function (room) {

    console.log('joining the room now '+ JSON.stringify(room));
    var clients = findClientsSocket(room.room); // This change is because of socket version change

    var numClients = clients.length; // This change is because of socket version change
    console.log('Clients connected to socket  : ' + numClients);
    if (numClients === 0) {
      socket.emit('empty', room);

      // TODO do the following work using API
    }
    else if (numClients > 0) {

     
      socket.join(room.room);
      room.socketid = socket.id;
      console.log("Your  socket id: ", socket.id)
      socket.emit('joined', room);

      //push customer session in the array of onlineWebClientsSession

      onlineWebClientsSession.push(room);
      
      var customer_in_company_room =[]; //only online customers who are in your room
      for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].room == room.room){
         customer_in_company_room.push(onlineWebClientsSession[j]);
        }
      }

      socket.broadcast.to(room.room).emit('customer_joined',customer_in_company_room);

      

     

     

    }

   
  });

  socket.on('getCustomerSessionsList',function(roomid){
    var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].room == roomid){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }

    console.log('getCustomerSessionsList is called.Currently in your room : ' + roomid +' ,customers online :' + customer_in_company_room.length); 
    socket.emit('returnCustomerSessionsList',customer_in_company_room);
  });
  socket.on('join scheduled meeting', function (room) {

    var clients = findClientsSocket(room.room); // This change is because of socket version change

    var numClients = clients.length; // This change is because of socket version change

    if (numClients === 0){
      socket.emit('empty', room.room);
    }
    else if (numClients > 0) {

      socket.join(room.room);
      //socket.set('nickname', room.username);
      room.socketid = socket.id;
      socket.emit('joined', room);

      socket.broadcast.to(room.room).emit('scheduled visitor join', room);

    }

    //console.log(io2.sockets.manager.rooms)
  });

  socket.on('create or join meeting for agent', function (room) {

    console.log('joining the room now '+ JSON.stringify(room));

    console.log(room.room);
    socket.join(room.room);
    
    var flag = 0;
    // append in online agents array
    if(room.agentEmail){
    //only push if not already pushed
    for(var i = 0;i< onlineAgents.length;i++)
    {
          if(onlineAgents[i].email == room.agentEmail){
            //set flag to true
            flag = 1;
            break;
          } 
    }
    if(flag == 0)
    {
       onlineAgents.push({email:room.agentEmail,socketid:socket.id,room:room.room,agentName : room.agentName,agentId : room.agentId});
 
    }
    }
    console.log("Agents online :");
    console.log(onlineAgents);
    //inform other agents that new agent is online now

    socket.broadcast.to(room.room).emit('updateOnlineAgentList', onlineAgents);
    var clients = findClientsSocket(room.room); // This change is because of socket version change

    var numClients = clients.length; // This change is because of socket version change
    console.log('Clients connected to room : ' + numClients);
   // socket.emit('joined', room);

      room.socketid = socket.id;
//      console.log('socket id is : ' + room.socketid);
      console.log("Agent  socket id: ", socket.id)

      socket.emit('agentjoined', room);


  });

  socket.on('returnMySocketId',function(){
      console.log('your socketid is : ' + socket.id);
      socket.emit('getmysocketid',socket.id);
  });

  socket.on('leave meeting for agent', function (room) {

    console.log('agent leaving the room now '+ JSON.stringify(room));

    socket.leave(room.room);



    //console.log(io2.sockets.manager.rooms)
  });

  socket.on('im', function(im){

    // TODO use the API to do the following work

  /*  var userchat = require('./../api/userchat/userchat.model.js');

    var newUserChat = new userchat({
      to : im.stanza.to,
      from : im.stanza.from,
      msg : im.stanza.msg,
      datetime : {type: Date, default: Date.now },
      request_id : im.stanza.request_id,
      companyid: im.room,
      visitoremail : im.stanza.visitoremail,
      agentemail : im.stanza.agentemail
    });

    newUserChat.save(function (err2) {
      if (err2) return console.log('Error 2'+ err2);

    });
    */

  io2.to(im.stanza.to_id).emit('im', im.stanza);
    //io2.sockets.socket(im.stanza.to_id).emit('im', im.stanza);

  });

  socket.on('connecttocall', function(call){

  io2.to(call.stanza.to_id).emit('connecttocall', call.stanza);
    //io2.sockets.socket(call.stanza.to_id).emit('connecttocall', call.stanza);

  });

  socket.on('agentid', function(data){

  io2.to(data.to).emit('agentid', data.agentid);
    //io2.sockets.socket(data.to).emit('agentid', data.agentid);

  });

  function findClientsSocket(roomId, namespace) {
    console.log('Rooms');

   /* var res = []
      , ns = io2.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          console.log('id ' + id + ' -- ' + ns.connected[id].rooms);
          console.log(roomId);
          var index = ns.connected[id].rooms.indexOf(roomId) ;
          if(index !== -1) {
            res.push(ns.connected[id]);
          }
        } else {
          res.push(ns.connected[id]);
        }
      }
    }
    return res;*/


     var res = [],
     room = io2.sockets.adapter.rooms[roomId];
     if (room) {
      for (var id in room) {
      res.push(io2.sockets.adapter.nsp.connected[id]);
      }
    }

    console.log(res);
  return res;
  }


  
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();


    socket.emit('news', 'you are connected to socket.io server');

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socketio, socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socketio, socket);
    console.info('[%s] CONNECTED', socket.address);

  });


};
