/**
 * Socket.io configuration
 */

'use strict';


// When the user disconnects.. perform this
function onDisconnect(io2, socket) {
}

// When the user connects.. perform this
function onConnect(io2, socket) {

  socket.on('logClient', function(data){
    //logger.clientLog(data.level, "Client side log: "+ data.data);
  });


// broadcast a user's message to other users
  socket.on('send:message', function (data) {
    console.log(data);
    if(data.to){
            console.log('sending point to point message');

            socket.broadcast.to(data.to).emit('send:message',{
            sender: data.sender,
            msg: data.msg,
            time:data.time
          });
    }
    else
    {
          socket.broadcast.emit('send:message', {
            sender: data.sender,
            msg: data.msg,
            time:data.time
          });
    }
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
      socket.emit('empty', room.room);

      // TODO do the following work using API
    }
    else if (numClients > 0) {

     
      socket.join(room.room);
      room.socketid = socket.id;
      console.log('socket id is : ' + room.socketid);
      console.log("Your  socket id: ", socket.id)

      socket.emit('joined', room);
      //  console.log('Widget is joining this room: ', room.room)

     // if(room.username !== 'agent123')
     //   socket.broadcast.to(room.room).emit('join', room);

    }

    //console.log(io2.sockets.manager.rooms)
   socket.broadcast.emit('customer_joined',room);
   
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
   
    var clients = findClientsSocket(room.room); // This change is because of socket version change

    var numClients = clients.length; // This change is because of socket version change
    console.log('Clients connected to room : ' + numClients);
   // socket.emit('joined', room);

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
