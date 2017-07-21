import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var crypto = require('crypto');

var Enumerable = require('linq');
var baseURL = `https://api.kibosupport.com`
var ss = require('../routes/socket');
var azure = require('azure-sb');

// notification hub for Agents
var notificationHubService = azure.createNotificationHubService('kiboengagetesthub','Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=TDM/hTOZxsgXq7hFcvO3/cJ3PeoQCRD82COpO7hwWbM=');
//for ios production
var notificationHubService1 = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagens.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=B2do9BVVK6ca1OQsJWQIE+6WlFfcGuWjr+280C+tIVY=');

var logger = require('../logger/logger');

var fs = require('fs');
var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',

 }

/************************* Customer APIS ************************************/
export function createsession(req, res) {
  //console.log('create session is called');

  //console.log(req.body.session);
  //console.log(req.body.session.length)
 if(req.body.session)
 {
  var options = {
      url: `${baseURL}/api/visitorcalls/createsession`,
      rejectUnauthorized : false,
      json: req.body.session,
      headers

    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

       // //console.log(body);

       if(!error && response.statusCode == 200)
       {
          // //console.log(body)
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.post(options, callback);
      }

      else{
          return res.status(422).json({statusCode : 422 ,message:'failed'});

      }

  }

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = new Date(a[key]); var y = new Date(b[key]);
       // return ((x < y) ? -1 : ((x > y) ? 1 : 0));
       return x.getTime() - y.getTime();
    });
}
export function getsessions(req, res) {
  //console.log('get session is called');

   var token = req.headers.authorization;
   var chat = [];
  var options = {
      url: `${baseURL}/api/visitorcalls/kiboengagesessions`,
      rejectUnauthorized : false,
       headers :  {
                 'Authorization': `Bearer ${token}`,

                 },


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

       // //console.log(body);

       if(!error && response.statusCode == 200)
       {
          var info = JSON.parse(body);
          var info_sorted = info.reverse();
          //console.log('info_sorted');
         // //console.log(info_sorted);
          return res.status(200).json(info_sorted);
       }
       else
       {
           //res.sendStatus(422);
           return res.status(422).json(error);

       }
   }
        request.get(options, callback);


  }



  //save chat
  /************************* Customer APIS ************************************/
export function savechat(req, res) {
  var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',

 }


  //console.log('create session is called');

  //console.log(req.body.chat);

 if(req.body.chat)
 {
  var options = {
      url: `${baseURL}/api/userchats/create`,
      rejectUnauthorized : false,
      headers,
      json: req.body.chat,


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

        //console.log(body);

       if(!error && response.statusCode == 201)
       {
         //  //console.log(body)
            return res.status(201).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.post(options, callback);
      }

      else{
          return res.status(422).json({statusCode : 422 ,message:'failed'});

      }

  }


// update status

export function updateStatus(req, res) {
  //console.log('update status is called');

  //console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/visitorcalls/updateStatus`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

        //console.log(body);

       if(!error && response.statusCode == 200)
       {
           //console.log(body)
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.post(options, callback);




  }



export function assignToAgent(req, res) {
  console.log('assignToAgent is called');
  console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/visitorcalls/assignToAgent`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        console.log(response.statusCode);

        console.log(body);

       if(!error && response.statusCode == 200)
       {
           //console.log(body)
            //send push notification to assigned agents
            var agentlist = req.body.agentemail;
            var payload = {
                              data: {

                                request_id : req.body.sessionid,
                                type: 'chatsession-assigned'
                              },
                              badge: 0
                            };
            for(var i=0;i< agentlist.length;i++){
                    console.log('----- obj is');
                    console.log(agentlist[i]);

                    sendPushNotification('Agent-'+agentlist[i],payload,'You are assigned a new session');
                   }
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           //res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }


export function movedToMessageChannel(req, res) {
  //console.log('movedToMessageChannel is called');
  //console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/visitorcalls/assignToChannel`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

        //console.log(body);

       if(!error && response.statusCode == 200)
       {
          // //console.log(body)
             sendpushToAllAgents(req.body.request_id,'Chat Session Moved To Another Channel','chatsession-moved');
            return res.status(200).json({statusCode : 201,message:'success'});
             //send push notification to all agents

       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }



/**** get user chat ***/

export function getuserchats(req, res) {
  //console.log('getuserchat');
  ////console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/userchats/`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);

        //console.log(body);

       if(!error && response.statusCode == 200)
       {

       /* var linq = Enumerable.from(body);
        //console.log(linq);
        var result =
            linq.groupBy(function(x){return x.request_id;})
            .select(function(x){return { request_id:x.key(),Value:x.last() };})
            .toArray();
        //console.log(result);*/
        var info = body;
        return res.status(200).json({statusCode : 201,userchats:info});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.get(options, callback);

  }



export function getspecificuserchats(req, res) {
  var token = req.headers.authorization;
  var options = {
      url: `${baseURL}/api/userchats/getSpecificChat`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        console.log(response.statusCode);

        //console.log(body);

       if(!error && response.statusCode == 200)
       {

       /* var linq = Enumerable.from(body);
        //console.log(linq);
        var result =
            linq.groupBy(function(x){return x.request_id;})
            .select(function(x){return { request_id:x.key(),Value:x.last() };})
            .toArray();
        //console.log(result);
        var info = result;*/
        return res.status(200).json({statusCode : 201,userchats:body});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }

// resolve session

export function resolvechatsession(req, res) {
  //console.log('resolvesession is called');
  //console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/visitorcalls/resolveSession`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);
        //console.log(body);

       if(!error && response.statusCode == 200)
       {
           //console.log(body)
           // inform mobile agents through push notification
           //send push notification to all agents
            sendpushToAllAgents(req.body.request_id,'Resolve Chat Session','chatsession-resolved');

            return res.status(200).json({statusCode : 201,message:'success'});
                   }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }

// pick session

export function pickchatsession(req, res) {
  //console.log('picksession is called');
  //console.log(req.body);
  var token = req.headers.authorization;


  var options = {
      url: `${baseURL}/api/visitorcalls/pickSession`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
     json : req.body

    };

    function callback(error, response, body) {
        //console.log(error);
        //console.log(response.statusCode);
        //console.log(body);

       if(!error && response.statusCode == 200)
       {
          // //console.log(body)
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }



export function getcustomersession(req,res){
        var  headers =  {
       'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
       'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
       'kibo-client-id': 'cd89f71715f2014725163952',

       }
      var options = {
      url: `${baseURL}/api/visitorcalls/getSession`,
      rejectUnauthorized : false,
      headers,
      json : req.body
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
          //call api to get customer details

      return res.status(200).json(body);
    }

    else
    {
     return res.status(422).json({message:error});
    }

    }
    request.post(options, callback);

}



export function getcustomerdetails(req,res){
        var  headers =  {
       'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
       'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
       'kibo-client-id': 'cd89f71715f2014725163952',

       }
      var options = {
      url: `${baseURL}/api/customers/getcustomer`,
      rejectUnauthorized : false,
      headers,
      json : req.body
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
          //call api to get customer details

      return res.status(200).json(body);
    }

    else
    {
     return res.status(422).json({message:error});
    }

    }
    request.post(options, callback);

}



export function updatereschedule(req, res) {
  //console.log('resolvesession is called');
  console.log(req.body);
  var token = req.headers.authorization;
  console.log(token);

  var options = {
      url: `${baseURL}/api/visitorcalls/rescheduleAbandonedSession`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);
        console.log(body);

       if(!error && response.statusCode == 200)
       {
           //console.log(body)
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }


/*************** This endpoint will be exposed to mobile clients ***************/
// Endpoint will receive chat message from mobile client and then forward to agents thorugh socket ******/

var agentSocket;
exports.register = function(socket) {
 agentSocket = socket;
 console.log('registering agent socket');
/* agentSocket.on('send:messageToSocket',function(newsreel,callba){

        // as is proper, protocol logic like
        // this belongs in a controller:
        console.log('emitting agent socket...');
        agentSocket.broadcast.emit(newsreel,function(message){
          return res.json(200,{'status' : 'success'});

        });
    });
    */
}

function sendpushToAgents(chatmessage){
  console.log('send push to agents');
  console.log(chatmessage);
  var payload = {
                              data: {
                                uniqueid:chatmessage.uniqueid,
                                request_id : chatmessage.request_id,
                                status : chatmessage.status,
                              },
                              badge: 0
                            };
  // this will execute if the chat session is already assigned to an agent or group
  if(chatmessage.assignedagentemail && chatmessage.assignedagentemail.length > 0){
    console.log('send push on each agents email address');
     for(var i = 0;i < chatmessage.assignedagentemail.length;i++){
                    var agentemail = chatmessage.assignedagentemail[i];
                   sendPushNotification('Agent-'+agentemail,payload,'Message received from customer');

  }


}
    //if the session is not assigned to any agent then we will send notifications to all agents who are in the team on which user has sent a message
     else{
      // fetch agents of particular department
             var  headers =  {
               'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
               'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
               'kibo-client-id': 'cd89f71715f2014725163952',

               }
              var options = {
                            url: `${baseURL}/api/deptagents/${chatmessage.departmentid}`,
                            rejectUnauthorized : false,
                            headers,

                    };
              function callback(error, response, body) {
                if(!error  && response.statusCode == 200) {
                   var agentlist = JSON.parse(body);
                 //  console.log(agentlist);
                   for(var i=0;i< agentlist.length;i++){
                    var obj = agentlist[i];
                    console.log('----- obj is');
                   // console.log(obj);
                    console.log(obj.agentid.email);
                    sendPushNotification('Agent-'+obj.agentid.email,payload,'Message received from customer');
                   }

              }

              else
              {
             //  return res.status(422).json({message:error});
              }
     }
       request.get(options, callback);
}
}



function sendpushToTeamAgents(chatmessage,teamagents,deptteams,type){
  console.log('send push to teamagents');
  console.log(chatmessage);
  console.log(teamagents.length);
  console.log(deptteams.length);
  var payload = {
                              data: {
                                uniqueid:chatmessage.uniqueid,
                                request_id : chatmessage.request_id,
                                status : chatmessage.status,
                                type:type,
                              },
                              badge: 0
                            };

    //if the session is not assigned to any agent then we will send notifications to all agents who are in the team on which user has sent a message
      // fetch agents of particular department
             var  headers =  {
                     'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
                     'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
                     'kibo-client-id': 'cd89f71715f2014725163952',

                     }
              var options = {
                                url: `${baseURL}/api/users/allagents/`,
                                rejectUnauthorized : false,
                                headers,

                        };
              function callback(error, response, body) {
              console.log(body);
                if(!error  && response.statusCode == 200) {
                   console.log('allagents body');
                   var info = JSON.parse(body);
                   var agentlist = info.agents;

                 //  console.log(agentlist);
                   for(var i=0;i< agentlist.length;i++){
                    var obj = agentlist[i];
                    console.log('----- obj is');
                   // console.log(obj);
                    console.log(obj.email);
                    if(showSession(chatmessage.departmentid,deptteams,teamagents,obj._id))
                      {
                      sendPushNotification('Agent-'+obj.email,payload,'Message received from customer');
                      }
                   }

              }


     }
       request.get(options, callback);

}
// endpoint called by customer (web or mobile)
export function getChatMessage(req, res) {
    console.log('getChatMessage is called');
    var chat   = req.body;
    console.log(chat);
    var  headers =  {
               'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
               'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
               'kibo-client-id': 'cd89f71715f2014725163952',

               }
    //create tuple for unseen messages on swagger
    var readstatusRequestPayload = {
                            group_id: req.body.departmentid,
                            company_id: req.body.companyid,
                            message_id: req.body.uniqueid,
                            request_id: req.body.request_id,
                          };

                          var optionsReadStatusRequest = {
                            url: `${baseURL}/api/readstatus/`,
                            rejectUnauthorized: false,
                            headers: headers,
                            json: readstatusRequestPayload,

                          };

                          console.log('request to read status payload: ', JSON.stringify(readstatusRequestPayload));

                          request.post(optionsReadStatusRequest,
                            function(errorReadStatus, responseReadStatus, bodyReadStatus){
                              console.log('response from read status');
                              ss.getchat(req.body);
                              console.log(responseReadStatus.status);
                              console.log(bodyReadStatus);

                          });



    //we need to send push to agents only who are assigned in teams which are assigned to groups in which chatsession arrives

              var options = {
                            url: `${baseURL}/api/deptteams/deptteamAgents`,
                            rejectUnauthorized : false,
                            headers,

                    };
              function callback(error, response, body) {
                if(!error  && response.statusCode == 200) {
                   var teamagentsDept = JSON.parse(body);
                   console.log('sending push notification to teamagents');
                   sendpushToTeamAgents(req.body,teamagentsDept.teamagents,teamagentsDept.deptteams,'chatsession'); // this will send customer message to mobile agents through push notification
                    return res.json(200,{'status' : 'success'});

                 }
                 else{
                  res.json(200,{'status' : 'failed'});
                 }
               }
               request.get(options,callback);

};

// endpoint called by agent (web or mobile)
export function getchatfromagent(req, res) {
    console.log('getchatfromagent is called');
    logger.serverLog('info', 'Inside getchatfromagent endpoint, req body = '+ JSON.stringify(req.body));

    var chat   = req.body;
    console.log(chat);
    ss.getchatfromAgent(req.body);
    return res.json(200,{'status' : 'success'});

};


//for mobile customers
function sendPushNotification(tagname,payload,alertmessage){
  console.log('sendPushNotification for message status update is called');
  console.log(tagname);
  console.log(payload);
  //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
  var iOSMessage = {
    alert : alertmessage,
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
      console.log('Azure push notification sent to Android using GCM Module, client number : '+ tagname);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });
  notificationHubService.apns.send(tagname, iOSMessage, function(error){
    if(!error){
      console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
      console.log(iOSMessage);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });
    notificationHubService1.apns.send(tagname, iOSMessage, function(error){
    if(!error){
  //    console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
    } else {
   //   console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });



}



export function updatechatstatus(req, res) {
  //console.log('resolvesession is called');
  console.log(req.body);
  var token = req.headers.authorization;
  console.log(token);

  var options = {
      url: `${baseURL}/api/userchats/updateStatus`,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);
        console.log(body);

       if(!error && response.statusCode == 200 && body['status'] == 'statusUpdated')
       {
           //console.log(body)
            // send push notification

            for(var i = 0;i < req.body.messages.length;i++){
                    var obj = req.body.messages[i];
                     var payload = {
                              data: {
                                uniqueid:obj.uniqueid,
                                request_id : obj.request_id,
                                status : obj.status,
                              },
                              badge: 0
                            };

              sendPushNotification('Client-'+req.body.customerid,payload,'status update');
            }
            return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

  }

/*** used by customer to send file to agent****/
export function uploadchatfile(req, res) {
  console.log('uploadchatfile called');
  console.log('req body');

  console.log(req.body.chatmsg);
  console.log(req.files);

  var obj = JSON.parse(req.body.chatmsg)
  console.log(obj.from);
 // var token = req.headers.authorization;

  //var today = new Date();
 // var uid = crypto.randomBytes(5).toString('hex');
 // var serverPath = '/' + 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate();
//  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
  var serverPath = obj.uniqueid;
  serverPath += '.' + req.files.file.type.split('/')[1];

  console.log(__dirname);
  console.log(req.headers);
  var dir = "./static/userfiles";
  var options = {
                            url: `${baseURL}/api/filetransfers/upload`,
                            headers : {
                               'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
                               'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
                               'kibo-client-id': 'cd89f71715f2014725163952',
                            } ,
                            rejectUnauthorized : false,
                            json: req.body


                          };
  if(req.files.file.size == 0) return res.send('No file submitted');

  fs.readFile(req.files.file.path, function (err, data) {
        var pathNew = dir + "/" + serverPath;
        req.body.path = serverPath;
        console.log(req.body);

        fs.writeFile(pathNew, data, function (err) {
          if(!err){
            function callback(error, response, body) {
                  console.log(error);
                  console.log(response.statusCode);
                  console.log(body);

                 if(!error && response.statusCode == 201)
                 {
                     // body.chatmsg.msg = body.filedata.file_type + ';' + body.chatmsg.msg;
                      ss.getchat( body.chatmsg);
                      return res.status(200).json({statusCode : 201,message:'success'});
                 }
                 else
                 {
                     return res.status(422).json({statusCode : 422 ,message:'failed'});

                 }
                 }
                     request.post(options, callback);

          }

        });
    });




}

/*** agent will call this end point ***/
export function uploadchatfileAgent(req, res) {
  console.log(req.body.chatmsg);
  var obj = JSON.parse(req.body.chatmsg)
  console.log(obj.from);
  var token = req.headers.authorization;

  //var today = new Date();
 // var uid = crypto.randomBytes(5).toString('hex');
 // var serverPath = '/' + 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate();
//  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
  var serverPath = obj.uniqueid;
  serverPath += '.' + req.files.file.type.split('/')[1];

  console.log(__dirname);
  console.log(req.headers);
  var dir = "./static/userfiles";
  var options = {
                            url: `${baseURL}/api/filetransfers/upload`,
                             headers :  {
                                 'Authorization': `Bearer ${token}`
                                 },
                            rejectUnauthorized : false,
                            json: req.body


                          };
  if(req.files.file.size == 0) return res.send('No file submitted');

  fs.readFile(req.files.file.path, function (err, data) {
        var pathNew = dir + "/" + serverPath;
        req.body.path = serverPath;
        console.log(req.body);

        fs.writeFile(pathNew, data, function (err) {
          if(!err){
            function callback(error, response, body) {
                  console.log(error);
                  console.log(response.statusCode);
                  console.log(body);

                 if(!error && response.statusCode == 201)
                 {
                     //console.log(body)
                      var payload = {
                              data: {
                                chat : body.chatmsg,
                                filemeta:body.filedata,
                                type : 'File'
                              },
                              badge: 0
                            };
                      var msg = 'You have received 1 new file from ' + req.body.from;
                      sendPushNotification('Client-'+req.body.to,payload,msg);
                    //  body.chatmsg.msg = body.filedata.file_type + ';' + body.chatmsg.msg;

                      ss.getchat( body.chatmsg);

                      return res.status(200).json({statusCode : 201,message:'success'});
                 }
                 else
                 {
                     return res.status(422).json({statusCode : 422 ,message:'failed'});

                 }
                 }
                     request.post(options, callback);

          }

        });
    });




}


export function downloadchatfile(req, res) {
  console.log(req.body);
  var token = req.headers.authorization;
  console.log(token);

  var options = {
      url: `${baseURL}/api/filetransfers/download`,
      headers : {
                               'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
                               'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
                               'kibo-client-id': 'cd89f71715f2014725163952',
      },
      rejectUnauthorized : false,
      json: req.body


    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);
        console.log(body);

       if(!error && response.statusCode == 200)
       {
            console.log(body)
            res.sendFile(body.path, {root: './static/userfiles'});
       }
       else
       {
           res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
       }
           request.post(options, callback);

}




// send push to only agents who are assigned to teams which are assigned to group
function showSession(departmentid,deptteams,teamagents,agentid){
    console.log('showSession called');
    console.log(deptteams);
    console.log(teamagents);
    var get_teams_assigned_to_group = deptteams.filter((c) => c.deptid._id == departmentid);
    console.log(get_teams_assigned_to_group.length);
    var is_agent_in_team = false;
    for(var i=0;i<get_teams_assigned_to_group.length;i++){
      console.log(get_teams_assigned_to_group[i]);
      for(var j=0;j<teamagents.length;j++){
        if(get_teams_assigned_to_group[i].teamid && get_teams_assigned_to_group[i].teamid._id == teamagents[j].groupid._id && teamagents[j].agentid._id == agentid ){
          is_agent_in_team = true;
          break;

        }
      }
      if(is_agent_in_team == true){
        break;
      }

    }
   return is_agent_in_team;
  }
function sendpushToAllAgents(sessionid,pushTitle,type){
  console.log('send push to all agents');
  var payload = {
                              data: {
                                request_id : sessionid,
                                status : pushTitle,
                                type:type,
                              },
                              badge: 0
                            };

 var  headers =  {
   'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
   'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
   'kibo-client-id': 'cd89f71715f2014725163952',

   }
  var options = {
                    url: `${baseURL}/api/users/allagents/`,
                    rejectUnauthorized : false,
                    headers,

            };
              function callback(error, response, body) {
                if(!error  && response.statusCode == 200) {
                   var info = JSON.parse(body);
                   var agentlist = info.agents;
                   for(var i=0;i< agentlist.length;i++){
                            var obj = agentlist[i];
                            console.log('----- obj is');
                            console.log(obj);
                            console.log(obj.email);
                            sendPushNotification('Agent-'+obj.email,payload,pushTitle);
                   }

              }

              else
              {
             //  return res.status(422).json({message:error});
              }
     }
       request.get(options, callback);
}


export function createforCloudkibo(req, res) {
  logger.serverLog('info', 'Inside KiboEngage endpoint, req body = '+ JSON.stringify(req.body));
  var allparams = req.body.allparam;
  if(allparams.conf_type === 'facebook'){
          var today = new Date();
          var uid = Math.random().toString(36).substring(7);
          var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

          var userid = req.body.request_id.split('$')[0]
          var pageid = req.body.request_id.split('$')[1]
          var messagebody= {
                          mid: unique_id,
                          seq: 1,
                          text: req.body.msg,
                        };

          var saveMsg = {
                        senderid: allparams.role == 'agent'?allparams.agentemail:allparams.visitoremail,
                        recipientid: allparams.role == 'agent'?allparams.visitoremail:allparams.agentemail,
                        companyid: req.body.companyid,
                        timestamp: Date.now(),
                        message: messagebody,

                        pageid: pageid,

                      }


          //call kiboengage API to save chat message
            var optionsChat = {
            url: `${baseURL}/api/fbmessages/`,
              rejectUnauthorized : false,
              headers : headers,
              json:saveMsg,

          };

          function callbackChat(error, response, body) {
              console.log('inside callbackchat');
              console.log(body);
              console.log(error);

              if(!error){

                  ss.broadcastfbchat(saveMsg);
                  return res.json(201,{status:'success'});
                }
              }
             request.post(optionsChat,callbackChat);

  }
  else{


    var options = {
      url: `${baseURL}/api/userchats/create`,
      rejectUnauthorized : false,
      headers,
      json: req.body,


    };

    function callback(error, response, body) {

       if(!error && response.statusCode == 201)
       {
            console.log(body)
            return res.status(201).json({statusCode : 201,message:'success'});
       }
       else
       {
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.post(options, callback);

  }
};

export function getallsessions(req, res) {
  //companyid will be required
  console.log('getallsessions called');
  logger.serverLog('info', 'Inside KiboEngage endpoint getallsessions'+JSON.stringify(req.body));
  var token = req.headers.authorization;
  console.log(token)
  //fetch mobile chat sessions from kiboengage swagger
  var options = {
      url: `${baseURL}/api/visitorcalls/mobilesessions`,
      rejectUnauthorized : false,
      headers :  {
                                 'Authorization': `Bearer ${token}`
                                 },

    };

    function callback(error, response, body) {
        //console.log(response.statusCode);
       if(!error && response.statusCode == 200)
       {
            var totalsessions= JSON.parse(body);
            //now fetch web chat sessions from socket
            var webchatsessions = ss.getwebchatsessions(req.body.companyid);
            logger.serverLog('info', 'There are webchatsessions' + JSON.stringify(webchatsessions));
            console.log('There are webchatsessions');
            console.log(webchatsessions.length);
            for(var j=0;j<webchatsessions.length;j++)
            {
              totalsessions.push(webchatsessions[j]);
            }

            console.log('totalsessions length' + totalsessions.length);
            return res.status(201).json(totalsessions);
       }
       else
       {
          // res.sendStatus(422);
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.get(options, callback);


};

export function getunreadsessionscount(req, res) {
  console.log('getunreadsessionscount');
  var token = req.headers.authorization;
  var options = {
      url: `${baseURL}/api/readstatus/getunreadsessionscount`,
      rejectUnauthorized : false,
      json: req.body,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },

    };

    function callback(error, response, body) {
       if(!error && response.statusCode == 200)
       {
          // //console.log(body)
            return res.status(200).json(body);
       }
       else
       {
           return res.status(422).json({statusCode : 422 ,message:'failed'});

       }
   }
        request.post(options, callback);




  }

export function markSimpleChatAsRead(req, res) {
  var readstatusRequestPayload = {
    agent_id: req.body.agent_id,
    request_id: req.body.request_id,
  };

  var optionsReadStatusRequest = {
    url: `${baseURL}/api/readstatus/deleteforagent`,
    rejectUnauthorized: false,
    headers :  {
      'Authorization': `Bearer ${token}`
    },
    json: readstatusRequestPayload,

  };

  console.log('request to delete status payload: ', JSON.stringify(readstatusRequestPayload));

  request.post(optionsReadStatusRequest,
    function(errorReadStatus, responseReadStatus, bodyReadStatus){
      console.log('response from read status');
      if (!errorReadStatus) {
        return res.status(201).json({ status: 'success' });
      }
      else {
        return res.status(422).json({statusCode: 422, data: errorReadStatus});

      }

    });
}
