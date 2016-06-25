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
    socket.broadcast.emit('send:message', {
      sender: data.sender,
      msg: data.msg,
      time:data.time
    });
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
    socket.broadcast.emit('customer_joined',room);
    /*var clients = findClientsSocket(room.room); // This change is because of socket version change

    var numClients = clients.length; // This change is because of socket version change

    if (numClients === 0) {
      socket.emit('empty', room.room);

      // TODO do the following work using API
/*
      configuration.findOne({}, function (err, gotConfig) {

        console.log(gotConfig);

        user.findOne({uniqueid: room.room, isAdmin: 'Yes'}, function (err2, gotUser) {

          companyprofile.findOne({companyid: room.room}, function (err, gotCompanyProfileData) {

            if (gotCompanyProfileData == null) return;
            else {
              console.log(gotCompanyProfileData)
              var sendgrid = require('sendgrid')(gotConfig.sendgridusername, gotConfig.sendgridpassword);

              var email = new sendgrid.Email({
                to: gotCompanyProfileData.notificationemailaddress,
                from: 'support@cloudkibo.com',
                subject: 'Visitor tried contacting you on your website',
                text: 'There is a visitor waiting for you.'
              });

              email.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
              '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
              '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
              '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
              '<p style="color: #ffffff">There was a visitor on your website.</p> </td></tr> </table> </td> </tr> </table> ' +
              '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
              '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
              '<tr> <td class="wrapper last"> <p> Hello ' + gotUser.firstname + ' ' + gotUser.lastname + '<br> We wanted to let you know that one visitor just needed live help on your website and no suppport agent was online. </p> <p> <ul> <li>Visitor Name: ' + room.username + '</li> ' +
              '<li>Visitor Email: ' + room.useremail + ' </li><li>Visitor Query: ' + room.question + ' </li><li>Visitor Current Page: ' + room.currentPage + ' </li><li>Visitor Current Page URL: ' + room.fullurl + ' </li><li>Visitor Phone: ' + room.phone + ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
              '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboSupport to schedule a call with your visitor. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
              '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

              sendgrid.send(email, function (err, json) {
                if (err) {
                  return console.log(err);
                }
              });
            }
          });

        });
      });
*/
   /* }
    else if (numClients > 0) {

     */
    //  socket.join(room.room);
      //socket.set('nickname', room.username);
      room.socketid = socket.id;
   //   socket.emit('joined', room);

      //  console.log('Widget is joining this room: ', room.room)

      //  console.log("maybe socket id: ", socket.id)

     // if(room.username !== 'agent123')
     //   socket.broadcast.to(room.room).emit('join', room);

    //}

    //console.log(io2.sockets.manager.rooms)
  
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

   // var clients = findClientsSocket(room.room); // This change is because of socket version change

  //  var numClients = clients.length; // This change is because of socket version change

    socket.join(room.room);
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
    var res = []
      , ns = io2.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          var index = ns.connected[id].rooms.indexOf(roomId) ;
          if(index !== -1) {
            res.push(ns.connected[id]);
          }
        } else {
          res.push(ns.connected[id]);
        }
      }
    }
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
