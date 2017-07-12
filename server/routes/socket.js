/**
 * Socket.io configuration
 */

'use strict';
var glob;
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('kiboengagetesthub','Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=TDM/hTOZxsgXq7hFcvO3/cJ3PeoQCRD82COpO7hwWbM=');
import request from 'request';
var baseURL = `https://api.kibosupport.com`
var logger = require('../logger/logger');
var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',

 }
function sendPushNotification(tagname, payload){
  //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
  var iOSMessage = {
    alert : payload.data.msg,
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
  //    console.log('Azure push notification sent to Android using GCM Module, client number : '+ tagname);
    } else {
   //   console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });
  notificationHubService.apns.send(tagname, iOSMessage, function(error){
    if(!error){
  //    console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
    } else {
   //   console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });



 
}

function sendPushNotificationToTeamAgents(data){
  console.log('sendPushNotificationToTeamAgents is called');
  var options = {
      url: `${baseURL}/api/deptteams/allagents/${data.departmentid}`,
      rejectUnauthorized : false,
      headers

    };

    function callback(error, response, body) {
        //console.log(error);
        console.log(response.statusCode);

    //   console.log(body);

       if(!error && response.statusCode == 200)
       {
            var agents_array = JSON.parse(body);
            for(var j=0;j<agents_array.length;j++){
              console.log('sending push notification to '+agents_array[j].email);
              var payload = {
                data: {
                  request_id : data.request_id, //this is request id of session
                  type:data.type,
                },
                badge: 0
              };
              console.log(payload.data);
              sendPushNotification('Agent-'+agents_array[j].email,payload)
                    
                  }
            return 'success';
       }
       else{
        return 'error';
       }
      
   }
        request.get(options, callback);
}



var onlineAgents = [];
var onlineWebClientsSession = []; //array to hold customer sessions who are online.This is for our WebClients

var userchats = [];//array to hold all  chat msgs

var fbchats = [];
var fbusers =[];

// When the user disconnects.. perform this
function onDisconnect(io2, socket) {
  console.log('calling onDisconnect  :' + socket.id);
  //Remove agent from onlineAgents array
  var room;
  console.log(socket.id);
  console.log(socket.room);
  console.log(socket.email);// adding email id of agent
  var onlineAgentsArray = [];       
  console.log(onlineAgents);
  var get_company_index = 0;
  var get_
  for(var j = 0;j<onlineAgents.length ;j++){
    if(onlineAgents[j].company == socket.room){
      var onlineAgentsArray = onlineAgents[j].onlineAgentsArray;
      for (var i=0;i<onlineAgentsArray.length;i++){
        console.log(onlineAgentsArray[i].email);
        if(onlineAgentsArray[i].email == socket.email){
          var socketid = onlineAgentsArray[i].socketid;
          console.log(onlineAgentsArray[i].socketid);
          for(var z=0;z< socketid.length;z++){
            if(socketid[z] == socket.id){
              console.log(onlineAgentsArray[i].socketid[z]);
              onlineAgents[j].onlineAgentsArray[i].socketid.splice(z,1);
              if(onlineAgents[j].onlineAgentsArray[i].socketid.length == 0){
                onlineAgents[j].onlineAgentsArray.splice(i,1);
                if(onlineAgents[j].onlineAgentsArray.length == 0){
                    onlineAgents.splice(j,1);

                }
              }
              break;
            }

          }
          break;
        }

      }
      room = socket.room;
      console.log(onlineAgents);
      for(var i=0;i<onlineAgents.length;i++){
        if(onlineAgents[i].company == socket.room){
          onlineAgentsArray = onlineAgents[i].onlineAgentsArray;
          break;
        }
      }
      socket.broadcast.to(room).emit('updateOnlineAgentList', onlineAgentsArray);

      break;

    }
 }
   

  //remove session also
  var session_remove = false;
  var room
  var req_id;
  var customer_in_company_room =[]; 
  for(var j = 0;j< onlineWebClientsSession.length;j++){

    if(onlineWebClientsSession[j].socketid == socket.id){
      console.log('Remove session,customer went offline'); 
      // here we need to send push notification to mobile agents so that they can update list of chat sessions on APP
       sendPushNotificationToTeamAgents({type:'customer-left','request_id':onlineWebClientsSession[j].request_id,'departmentid':onlineWebClientsSession[j].departmentid});

      room = onlineWebClientsSession[j].companyid;
      req_id = onlineWebClientsSession[j].request_id;
      console.log(req_id);
      
       // update abandoned sessions list if the session status is new
     
      if(onlineWebClientsSession[j].status == 'new'){
         customer_in_company_room =[]; //only online customers who are in your room

          for(var j = 0;j<onlineWebClientsSession.length;j++){
            if(onlineWebClientsSession[j].companyid == room){
              customer_in_company_room.push(onlineWebClientsSession[j]);
            }
          }

          socket.broadcast.to(room).emit('customer_left',customer_in_company_room);
        }
    onlineWebClientsSession.splice(j,1);
      
  console.log('customers online : ' + customer_in_company_room.length);
      //we will remove all the user chat from socket.io with this request id
      console.log('length of userchats before: '+ userchats.length)
      for(var k=0;k<userchats.length;k++){
        if(userchats[k].request_id == req_id){
           console.log('Remove chat message,customer went offline');

          userchats.splice(k,1);
        }
      }
      console.log('length of userchats after: '+ userchats.length)
      console.log(userchats);
      console.log(onlineWebClientsSession.length);
      session_remove = true
      break;
    }
  }

  if(session_remove == true){
    customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].companyid == room){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }

  console.log('customers online : ' + customer_in_company_room.length);
  //ask clients to update their session list
   socket.broadcast.to(room).emit('returnCustomerSessionsList',customer_in_company_room);
   session_remove = false;
  }
  socket.leave(room);

}
// When the user connects.. perform this
function onConnect(io2, socket) {
 console.log(socket.id + ' connected');
 console.log('client connected to socket...');
 socket.emit('syncdata');
 // Insert sockets below
  //require('../controllers/chat.controller').register(socket,io2);

  socket.on('logClient', function(data){
    logger.clientLog('info',data.msg + JSON.stringify(data.data) );
  });


// from agent to customer
  socket.on('send:message', function (data) {

    /*** Add the logic here to send message as a push notification using customerid as a tag name for moble customers
    ***/

    console.log(data);
    // don't push messages in userchats that come from mobile
    //add logic here
    if(data.fromMobile && data.fromMobile == 'yes'){
        console.log('data from mobile.Not pushed in userchats');
        var payload = {
        data: {
          uniqueid: data.uniqueid, // this is uniqueid of message
          request_id : data.request_id, //this is request id of session
          msg : data.msg,
        },
        badge: 0
      };

      sendPushNotification('Client-'+data.customerid.customerID,payload)
    }

    else     {
          userchats.push(data);
         }

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
            is_seen:data.is_seen,
            departmentid : data.departmentid,




          });
    }

    if(data.groupmembers && data.groupmembers.length > 1 && data.sendersEmail){
      var socketids =[]

           for(var j=0;j< data.groupmembers.length;j++){
                for(var i = 0;i < onlineAgents.length;i++)
                {
                  if(onlineAgents[i].email == data.groupmembers[j] && onlineAgents[i].email != data.sendersEmail){
                     console.log('agent is online');

                    socketids.push(onlineAgents[i].socketid);
                    //break;
                  }

              }
            }

           for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  io2.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                 departmentid:data.departmentid,

                              });
                }
    }

    if(data.assignedagentemail && data.assignedagentemail.length > 1){
      //this means that the message is sent on a group,we will inform all the members of the group that the chat session is assigned to the group
           var socketids =[]
           for(var j=0;j< data.assignedagentemail.length;j++){
                for(var i = 0;i < onlineAgents.length;i++)
                {
                  if(onlineAgents[i].email == data.assignedagentemail[j]){
                     console.log('agent is online');

                    socketids.push(onlineAgents[i].socketid);
                    //break;
                  }

            }
          }

           for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  io2.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                 departmentid:data.departmentid,

                              });
                }


    }


  });

function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

//push mobile chat sessions retreived from server into list of socket sessions
socket.on('getCustomerSessionsListFirst',function(sessions,roomid){
    var customer_in_company_room =[]; //only online customers who are in your room
    console.log(roomid);
    console.log('mobile sessions length : ' + sessions.length);
    for(var i = 0 ;i< sessions.length;i++){
    onlineWebClientsSession.push(sessions[i]);
  }
    //remove duplicates
    onlineWebClientsSession = removeDuplicates(onlineWebClientsSession,'request_id');
    console.log('total no. of sessions :' + onlineWebClientsSession.length);
    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].companyid == roomid){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }

    console.log('getCustomerSessionsList is called.Currently in your room : ' + roomid +' ,customers online :' + customer_in_company_room.length);
    socket.emit('returnCustomerSessionsList',customer_in_company_room);
  });

 socket.on('informGroupMembers', function (data) {
    console.log('group members in group');
    console.log(data.agentemail);
    //send agentemail array to every one in the group
    var onlineAgentsCompany = [];
    for(var i=0;i<onlineAgents.length;i++){
      if(onlineAgents[i].company == data.companyid){
        onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
        break;
      }
    }

    //collect all socket ids of an agent
    var socketids = [];
   
    for(var j = 0;j< data.agentemail.length;j++){
              for(var i = 0;i < onlineAgentsCompany.length;i++)
              {
                if(onlineAgentsCompany[i].email  == data.agentemail[j])
                {
                  console.log('agent is online');
                  for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                  break;
                }
              }
              }
        

    for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  io2.to(socketids[i]).emit('send:teammembers',{'getmembers':data.agentemail});
                }

});
 socket.on('informAgent', function (data) {
    console.log(data);
    userchats.push(data);

    var previous_chat = []
    for(var i=0;i< userchats.length;i++){
      if(userchats[i].request_id == data.request_id){
      previous_chat.push(userchats[i])
    }
    }

    console.log('chat messages of this conversation is of length : ' + previous_chat.length);
  
    var onlineAgentsCompany = [];
    for(var i=0;i<onlineAgents.length;i++){
      if(onlineAgents[i].company == data.companyid){
        onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
        break;
      }
    }

    //collect all socket ids of an agent
    var socketids = [];
   
    for(var j = 0;j< data.agentemail.length;j++){
              for(var i = 0;i < onlineAgentsCompany.length;i++)
              {
                if(onlineAgentsCompany[i].email  == data.agentemail[j])
                {
                  console.log('agent is online');
                  for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                  break;
                }
              }
              }
        

    for(var i=0;i<socketids.length;i++){
        io2.to(socketids[i]).emit('informAgent',previous_chat);
                
    }





  });




socket.on('getuserchats',function(room){
  //return userchats currently happening in room
  var roomchats =[];
  console.log('user chats : ' + userchats.length);
  for(var c = 0;c<userchats.length;c++){

    if(userchats[c].companyid == room)
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

    // if session is mobile then inform customer through push notification
    if(data.fromMobile && data.fromMobile == 'yes' ){

      var payload = {
        data: {
          agentname: data.assignedagentname, // this is array field
          agentemail : data.assignedagentemail, //this is array field
          agentid : data.agentid, //this is array field
          msg : data.msg ,
          uniqueid: data.uniqueid, // this is uniqueid of message
          request_id : data.request_id, //this is request id of session

        },
        badge: 0
      };

      sendPushNotification('Client-'+data.customerid.customerID,payload)
    }
    else{
    io2.to(data.socketid).emit('send:getAgent',{
           data:data
          });
    }

  });

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
      if(onlineWebClientsSession[j].companyid == data.room){
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
      if(onlineWebClientsSession[j].companyid == data.room){
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
    var onlineAgentsArray=[];
     for(var i=0;i<onlineAgents.length;i++){
        if(onlineAgents[i].company == socket.room){
          onlineAgentsArray = onlineAgents[i].onlineAgentsArray;
          break;
        }
      }
  
    socket.emit('updateOnlineAgentList',onlineAgentsArray);
  });

  
  
  socket.on('leave', function (room) {

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

      //inform mobile agents that customer has arrived on widget
      sendPushNotificationToTeamAgents({type:'customer-joined','request_id':room.request_id,'departmentid':room.departmentid});

      onlineWebClientsSession = onlineWebClientsSession.reverse();
      var customer_in_company_room =[]; //only online customers who are in your room
      for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].companyid == room.room){
         customer_in_company_room.push(onlineWebClientsSession[j]);
        }
      }

      console.log('Customer joined room');
      socket.broadcast.to(room.room).emit('customer_joined',customer_in_company_room,room);


    }


  });

  socket.on('getCustomerSessionsList',function(roomid){
    var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
      if(onlineWebClientsSession[j].companyid == roomid){
        customer_in_company_room.push(onlineWebClientsSession[j]);
      }
    }

    console.log('getCustomerSessionsList is called.Currently in your room : ' + roomid +' ,customers online :' + customer_in_company_room.length);
    socket.emit('returnCustomerSessionsList',customer_in_company_room);
  });
 

  socket.on('create or join meeting for agent', function (room) {

          console.log('joining the room now '+ JSON.stringify(room));

          console.log(room.room);
          socket.join(room.room);
         //add lines to add company id and email in socket object
          
          socket.room = room.room  //adding company id
          socket.email = room.agentEmail // adding email id of agent
         
          var flag = 0;
          var flag_multilogin=0;
          if(room.agentEmail){
            // check if company id is in array of online agents
            for(var i = 0;i< onlineAgents.length;i++)
            {
                  if(onlineAgents[i].company == room.room){
                    //set flag to true
                    flag = 1;
                    break;
                  }
            }
          if(flag == 0)
          {
            //this means that company is not in array:
            var onlineAgentsArray = [];

             onlineAgentsArray.push({email: room.agentEmail, socketid: [socket.id],agentName : room.agentName,agentId : room.agentId})
             onlineAgents.push({company: room.room, onlineAgentsArray: onlineAgentsArray});

          //}
          }

          else{
            // company is already in the list of onlineAgents, just add the current agent
            var list_of_onlineagents = onlineAgents[i].onlineAgentsArray;
            for(var j=0;j<list_of_onlineagents.length;j++){
              if(list_of_onlineagents[j].email == room.agentEmail){
                //this means that agent is online from another workstation (multilogin case)
                flag_multilogin = 1;
                break;
              }
            }

            if(flag_multilogin == 1){
              //only add current socket id
              onlineAgents[i].onlineAgentsArray[j].socketid.push(socket.id);
            }
            else{

               var onlineAgentsArray;
               if(onlineAgents[i].onlineAgentsArray && onlineAgents[i].onlineAgentsArray.length >0 ){
                onlineAgentsArray = onlineAgents[i].onlineAgentsArray;
               }
               else{
                onlineAgentsArray = [];
               }
               onlineAgentsArray.push({email: room.agentEmail, socketid: [socket.id],agentName : room.agentName,agentId : room.agentId})
               onlineAgents[i].onlineAgentsArray = onlineAgentsArray;

            }
          }
        }
          console.log("Agents online :");
          //inform other agents that new agent is online now
          var onlineAgentsArray=[];
           for(var i=0;i<onlineAgents.length;i++){
              if(onlineAgents[i].company == room.room){
                onlineAgentsArray = onlineAgents[i].onlineAgentsArray;
                break;
              }
            }
          console.log(onlineAgentsArray);
            
          socket.broadcast.to(room.room).emit('updateOnlineAgentList', onlineAgentsArray);
          var clients = findClientsSocket(room.room); // This change is because of socket version change

          var numClients = clients.length; // This change is because of socket version change
          console.log('Clients connected to room : ' + numClients);
          room.socketid = socket.id;
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
     //socket.emit('disconnect');



    //console.log(io2.sockets.manager.rooms)
  });

  socket.on('updatesessionstatusFB',function(data){
  console.log('updatesessionstatusFB is called');
  console.log(data);
  console.log(fbusers);
  for(var i =0 ;i< fbusers.length ;i++){
    if(fbusers[i].pageid.pageid == data.pageid && fbusers[i].user_id.user_id == data.user_id){
      console.log('updating session status :');
      fbusers[i].status = data.status;
      fbusers[i].agent_ids.push(data.agentid);
      console.log(fbusers[i]);
      break;
    }
  }

  //ask clients to update their session list
   socket.broadcast.to(data.room).emit('updateFBsessions',data);
 
 });

  //broadcast facebook messages send by agent to other agents 
  socket.on('broadcast_fbmessage',function(data){
        console.log('broadcast fb message is called');
        fbchats.push(data);
        socket.broadcast.to(data.companyid).emit('send:fbmessage',data);

  });

  socket.on('connecttocall', function(call){

  if(!call.stanza.to_id){
    console.log('customer calling to agent');
    //this call is from customer to agent
    //check if agent is online
    console.log(call);
    var onlineAgentsCompany = [];
    for(var i=0;i<onlineAgents.length;i++){
      if(onlineAgents[i].company == call.room){
        onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
        break;
      }
    }

    //collect all socket ids of an agent
    var socketids = [];
    for(var i = 0;i < onlineAgentsCompany.length;i++)
                {
                  if(onlineAgentsCompany[i].email == call.stanza.agentemail){
                     console.log('agent is online');
                     for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                    
                    break;
                  }

              }

      for(var i = 0;i < socketids.length;i++)
            {
                io2.to(socketids[i]).emit('connecttocall', call.stanza);
              
            }

  }
  else{
    //from agent to customer
  io2.to(call.stanza.to_id).emit('connecttocall', call.stanza);
    //io2.sockets.socket(call.stanza.to_id).emit('connecttocall', call.stanza);

  }
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



exports.socketf = function (socketio) {
  glob = socketio;
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

    console.log(onlineAgents);

  });




};


/******** not exporting in controller file **********/
exports.getchat = function(data){
  console.log('socket get chat is called');
  //console.log(glob);
   var onlineAgentsCompany = [];
  for(var i=0;i<onlineAgents.length;i++){
    if(onlineAgents[i].company == data.companyid){
      onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
      break;
    }
  }
  if(data.fromMobile == 'no'){
     userchats.push(data);
  }
  /*if(data.toagent){
            console.log('sending point to point message to Agent');
            //find the socket id
            var socketids =[]
           
            for(var j=0;j< data.toagent.length;j++){
                for(var i = 0;i < onlineAgentsCompany.length;i++)
                {
                  if(onlineAgentsCompany[i].email == data.toagent[j]){
                     console.log('agent is online');
                     for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                    
                    break;
                  }

              }
            }

           for(var i=0;i<socketids.length;i++){
            console.log('socketids');
            console.log(socketids);
            glob.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                fromMobile : data.fromMobile,
                                status : 'sent',
                                departmentid:data.departmentid,
                              });
          }

    }
    //broadcast message to all agents
    else{
     */ 
        
            glob.to(data.companyid).emit('send:message',{
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
                                          is_seen:data.is_seen,
                                          fromMobile : data.fromMobile,
                                          status : 'sent',
                                          departmentid:data.departmentid,
                                        });
  //  }
  
}



/****** Endpoint used for sending message to customers received by agent(web or mobile)

/******** not exporting in controller file **********/
exports.getchatfromAgent = function(data){
  console.log('socket get chat from agent is called');
  logger.serverLog('info', 'This is body in getchatfromAgent socket '+ JSON.stringify(data) );
 
  console.log(data);
  var onlineAgentsCompany = [];
  for(var i=0;i<onlineAgents.length;i++){
    if(onlineAgents[i].company == data.companyid){
      onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
      break;
    }
  }
    // don't push messages in userchats that come from mobile
    //add logic here for sending push notification to desired customer
    if(data.fromMobile && data.fromMobile == 'yes'){
        console.log('data from mobile.Not pushed in userchats');
        var payload = {
        data: {
          uniqueid: data.uniqueid, // this is uniqueid of message
          request_id : data.request_id, //this is request id of session
          msg : data.msg,
        },
        badge: 0
      };

      sendPushNotification('Client-'+data.customerid.customerID,payload)
    }

    // for web customer
    else     {
          userchats.push(data);
         }

    //this will send agents' message to customer
    if(data.socketid){
            console.log('sending point to point message');
            glob.to(data.socketid).emit('send:message',{
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
            is_seen:data.is_seen,
            departmentid:data.departmentid,




          });
    }


    // this will replay agents own message on other workstations:
  /*  var socketids=[];
    for(var i = 0;i < onlineAgentsCompany.length;i++)
                {
                  if(onlineAgentsCompany[i].email == data.sendersEmail){
                     for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                             socketids.push(onlineAgentsCompany[i].socketid[k]);
                   
                      
                     }
                    
                    break;
                  }
                }
    console.log('socketids')
   console.log(socketids);
    for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  glob.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                departmentid:data.departmentid,

                              });
                } 
// Logic for sending message to all other members
    if(data.teammembers && data.teammembers.length > 1 && data.sendersEmail){
      
      var socketids =[]
  
           for(var j=0;j< data.teammembers.length;j++){
                for(var i = 0;i < onlineAgentsCompany.length;i++)
                {
                  if(onlineAgentsCompany[i].email == data.teammembers[j] && onlineAgentsCompany[i].email != data.sendersEmail){
                     console.log('agent is online');
                     for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                    
                  //  socketids.push(onlineAgents[i].socketid);
                    break;
                  }

              }
            }

           for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  glob.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                departmentid:data.departmentid,

                              });
                }
    }

    if(data.assignedagentemail && data.assignedagentemail.length > 1){
      //this means that the message is sent on a group,we will inform all the members of the group that the chat session is assigned to the group
           var socketids =[]
           for(var j=0;j< data.assignedagentemail.length;j++){
                for(var i = 0;i < onlineAgentsCompany.length;i++)
                {
                  if(onlineAgentsCompany[i].email == data.assignedagentemail[j]){
                     console.log('agent is online');
                     for(var k=0;k< onlineAgentsCompany[i].socketid.length;k++){
                      socketids.push(onlineAgentsCompany[i].socketid[k]);
                     }
                    //socketids.push(onlineAgents[i].socketid);
                    break;
                  }

            }
          }

           for(var i=0;i<socketids.length;i++){
                     //sendingSocket.to(sendingSocket.id).emit('publicMessage', 'Hello! How are you?')
                  glob.to(socketids[i]).emit('send:message',{
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
                                is_seen:data.is_seen,
                                departmentid:data.departmentid,

                              });
                }


    }
*/

//sending message to all other agents
    console.log('sending message to other agents in company');
    glob.to(data.companyid).emit('send:message',{
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
                                is_seen:data.is_seen,
                                departmentid:data.departmentid,
                                fromMobile:data.fromMobile,

                              });


}




// handling Facebook Chat Messages
/******** not exporting in controller file **********/
exports.getfbchat = function(data){
  console.log('socket get Fb chat is called');
  logger.serverLog('info', 'This is body in getfbchat '+ JSON.stringify(data) );
 
  console.log(data);

  var onlineAgentsCompany = [];
  for(var i=0;i<onlineAgents.length;i++){
    if(onlineAgents[i].company == data.companyid){
      onlineAgentsCompany = onlineAgents[i].onlineAgentsArray;
      break;
    }
  }
  console.log('onlineAgentsCompany');
  console.log(onlineAgentsCompany);
  var flag=0;
  for(var i=0;i< fbusers.length;i++){
    if(fbusers[i].user_id.user_id == data.socketsession.user_id.user_id){
      flag = 1;
      break;
    }
  }
  if(flag == 0){
     fbusers.push(data.socketsession);
     //inform agents that a new customer arrives on fbmessenger
    //broadcast message to all agents
      glob.to(data.chatobj.companyid).emit('send:fbcustomer',data.socketsession);
      setTimeout(function(){ 
                fbchats.push(data.chatobj);
                glob.to(data.chatobj.companyid).emit('send:fbmessage',data.chatobj);
          }, 1000);
      }
  else{    
      fbchats.push(data.chatobj);
      glob.to(data.chatobj.companyid).emit('send:fbmessage',data.chatobj);
      }

}

exports.getfileChatfromAgent = function(data){
    logger.serverLog('info', 'This is body in getfileChatfromAgent '+ JSON.stringify(data) );
 
    fbchats.push(data.chatobj);

    glob.to(data.chatobj.companyid).emit('send:fbmessage',data.chatobj);

}

//endpoint to get websessions
exports.getwebchatsessions = function(companyid){
    logger.serverLog('info', 'This is body in getwebchatsessions '+ companyid );
    var customer_in_company_room =[]; //only online customers who are in your room

    for(var j = 0;j<onlineWebClientsSession.length;j++){
            if(onlineWebClientsSession[j].companyid == companyid && onlineWebClientsSession[j].platform == 'web'){
              customer_in_company_room.push(onlineWebClientsSession[j]);
            }
          }
    return customer_in_company_room;
    

}
exports.broadcastfbchat = function(fbchat){
   //broadcast facebook messages send by agent to other agents 
        logger.serverLog('info','broadcast fb message is called ' + JSON.stringify(fbchat) );
        fbchats.push(fbchat);
        glob.to(fbchat.companyid).emit('send:fbmessage',fbchat);

  

}
exports.verifyThisAccount = function (email, uniqueid) {
  console.log(onlineAgents);
  console.log(uniqueid);
  console.log(email);
  for (var i in onlineAgents) {
    if(onlineAgents[i].company === uniqueid) {
      console.log('company found with id '+ uniqueid)
      console.log('agents in company '+ JSON.stringify(onlineAgents[i].onlineAgentsArray))
      for (var j in onlineAgents[i].onlineAgentsArray) {
        if(onlineAgents[i].onlineAgentsArray[j].email === email) {
          console.log(onlineAgents[i].onlineAgentsArray[j])
          glob.to(onlineAgents[i].onlineAgentsArray[j].socketid).emit('verified', onlineAgents[i]);
        }
      }
    }
  }
}

