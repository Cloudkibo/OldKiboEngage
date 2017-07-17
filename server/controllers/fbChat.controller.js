import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
import Buffer from 'Buffer';
import path from 'path';
import fs from 'fs';
var og = require('open-graph');
var logger = require('../logger/logger');
var socket = require('../routes/socket');
var headers = {
  'kibo-app-id': '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
  'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
  'kibo-client-id': 'cd89f71715f2014725163952',
  'content-type': 'application/json'
}
var azure = require('azure-sb');
// notification hub for Agents
var notificationHubService = azure.createNotificationHubService('kiboengagetesthub', 'Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=TDM/hTOZxsgXq7hFcvO3/cJ3PeoQCRD82COpO7hwWbM=');

var baseURL = `https://api.kibosupport.com`
// facebook webhook
//ßconst token = "EAAPwdwgvYOMBAOsSCEbRiBZB403aWrJ2FtFXd3wfsmEnsZAGD2My1uX6THyegD69Wx2HlkhMyWlfNZBNEZBlTgiqZBBr41SHiHAEZAA13J3GHDZBpZB0ySZAsFkpcVInpdghdQ0ba9y2hOfK6HfniJ3tm56r1BnwBGQ65gZAzWQaiKAgZDZD";

export function verifyhook(req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge'])
  }
  else {
    res.send('Error, wrong token')
  }
}

export function chatwebhook(req, res) {

  console.log('chat webhook is called');
  logger.serverLog('info', 'This is body in chatwebhook ' + JSON.stringify(req.body));

  // call api to fetch page info from pageid
  let messaging_events = req.body.entry[0].messaging

  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    console.log(event);
    if (event.message && !event.message.is_echo) {
      if (event.message.attachments) {
        console.log(event.message.attachments);
      }
      let sender = event.sender.id;
      let page = event.recipient.id;
      console.log('page id is' + page);
      var options = {
        url: `${baseURL}/api/fbpages/getpagewithTeams`,
        headers: headers,

        form: {
          'pageid': page,
        }

      };

      function callback(error, response, data) {
        //console.log(body);
        console.log(error);
        if (!error && body != 'Not Found') {
          var body = JSON.parse(data);
          var fbpage = body.page;
          console.log('fbpage is');
          console.log(fbpage);
          var teamagents = body.teamagents;
          var fbpageteams = body.fbpageteams;
          let token = fbpage.pageToken;
          let companyid = fbpage.companyid;

          // fetch customer details
          var optionsG = {
            url: 'https://graph.facebook.com/v2.6/' + sender + '?access_token=' + token,
            qs: {access_token: token},
            method: 'GET'

          };

          function callbackG(error, response, body) {
            console.log(body);
            let customer = JSON.parse(body);
            logger.serverLog('info', 'This is customer ' + JSON.stringify(customer));

            if (!error) {
              // call kiboengage api to create session
              var customerobj = {
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'user_id': sender, //this is the facebook id of a customer
                'pageid': fbpage._id,
                'email': '',
                'timestamp': customer.locale,
                'timezone': customer.timezone,
                'companyid': companyid,
                'gender': customer.gender,
                'profile_pic': customer.profile_pic,
                'requesttime': Date.now(),
              }

              console.log('customerobj obj is ');
              console.log(customerobj);
              //call kiboengage API to save customer
              var optionsC = {
                url: `${baseURL}/api/fbsessions/`,
                headers: headers,
                json: customerobj,

              };

              function callbackC(error, response, bodyC) {

                // if the attachment contains url then extract meta data of url first
                var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                var onlyUrl = ''
                if (event.message.text) {
                  var testUrl = event.message.text.match(urlRegex);
                  onlyUrl = testUrl && testUrl[0];
                }


                logger.serverLog('info', 'This is the result of linkify ' + onlyUrl);
                if (onlyUrl != null && onlyUrl != '') {
                  console.log('url Found in text' + onlyUrl);
                  logger.serverLog('info', 'url Found in text ' + onlyUrl);
                  // now the url is found fetch the meta data of url
                  og(onlyUrl, function (err, meta) {
                    console.log(meta);
                    logger.serverLog('info', 'This is body in og ' + JSON.stringify(meta));
                    if (!error) {
                      console.log('saving chat message');
                      logger.serverLog('info', 'This is fbsession ' + JSON.stringify(bodyC.fbsession));
                      console.log(bodyC.fbsession);

                      //call api to save chat message
                      var chatobj = {
                        senderid: sender, // this is the user_id or page_id
                        recipientid: page,
                        timestamp: event.timestamp,
                        message: event.message,
                        companyid: companyid,
                        urlmeta: meta,
                      }
                      //call kiboengage API to save chat message
                      var optionsChat = {
                        url: `${baseURL}/api/fbmessages/`,
                        rejectUnauthorized: false,
                        headers: headers,
                        json: chatobj,

                      };

                      function callbackChat(error, response, body) {
                        console.log('inside callbackchat');
                        console.log(body);
                        console.log(error);

                        if (!error) {

                          // emit the chat message on socket
                          var socketsession = {

                            'user_id': {
                              'first_name': customer.first_name,
                              'last_name': customer.last_name,
                              'email': '',
                              'timestamp': customer.locale,
                              'timezone': customer.timezone,
                              'profile_pic': customer.profile_pic,
                              'gender': customer.gender,
                              'user_id': sender,
                              '_id': bodyC.fbsession.user_id,

                            }, //this is the facebook id of a customer
                            'pageid': fbpage,
                            'companyid': customerobj.companyid,
                            'requesttime': customerobj.requesttime,
                            'status': bodyC.fbsession.status == 'resolved' ? 'assigned' : bodyC.fbsession.status,
                            'agent_ids': bodyC.fbsession.agent_ids,


                          }

                          var readstatusRequestPayload = {
                            group_id: fbpage._id,
                            company_id: customerobj.companyid,
                            message_id: body._id,
                            request_id: fbpage.pageid +'$'+ customerobj.user_id,
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
                              //console.log(responseReadStatus);
                              //console.log(bodyReadStatus);

                          });

                          console.log('socketsession is');
                          console.log(socketsession);
                          socket.getfbchat({chatobj, socketsession});
                          //we need to send push to only agents who are in teams assigned to fbpage
                          sendpushToTeamAgents({
                            'customerid': customerobj.user_id,
                            'msgid': body._id,
                            'type': 'fbchat',
                            'status': 'New message from Facebook Customer'
                          }, 'New message from Facebook Customer', fbpage._id, fbpageteams, teamagents);

                          // update fbsession status if marked resolved

                          if (bodyC.fbsession && bodyC.fbsession.status == 'resolved') {
                            var customerobjS = {
                              companyid: bodyC.fbsession.companyid,
                              pageid: bodyC.fbsession.pageid,
                              user_id: bodyC.fbsession.user_id,
                              status: 'assigned',
                            }
                            //call kiboengage API to save customer
                            var optionsS = {
                              url: `${baseURL}/api/fbsessions/fbupdatestatus`,
                              headers: headers,
                              json: customerobjS,

                            };


                            function callbackS(error, response, bodyS) {
                              console.log(error);
                              console.log(bodyS);
                              if (!error) {
                                //send push notification to all agents
                                console.log('sending push to all agents');
                                //  sendpushToAllAgents({'customerid' : customerobj.user_id,'msgid':body._id,'type':'fbchat','status':'New message from Facebook Customer'},'New message from Facebook Customer');

                              }
                              else {
                                return res.status(422).json({statusCode: 422, data: error});
                              }
                            }

                            request.post(optionsS, callbackS);

                            //return res.status(201).json({status:"success"});
                          }

                        }
                        else {
                          return res.status(422).json({statusCode: 422, data: error});

                        }

                      }

                      request.post(optionsChat, callbackChat);
                    }
                  });
                }
                //if no url
                else {
                  console.log(bodyC);
                  console.log(error);
                  if (!error) {
                    console.log('saving chat message');
                    console.log(bodyC.fbsession);

                    //call api to save chat message
                    var chatobj = {
                      senderid: sender, // this is the user_id or page_id
                      recipientid: page,
                      timestamp: event.timestamp,
                      message: event.message,
                      companyid: companyid,
                    }
                    //call kiboengage API to save chat message
                    var optionsChat = {
                      url: `${baseURL}/api/fbmessages/`,
                      rejectUnauthorized: false,
                      headers: headers,
                      json: chatobj,

                    };

                    function callbackChat(error, response, body) {
                      console.log('inside callbackchat');
                      console.log(body);
                      console.log(error);

                      if (!error) {

                        // emit the chat message on socket
                        var socketsession = {

                          'user_id': {
                            'first_name': customer.first_name,
                            'last_name': customer.last_name,
                            'email': '',
                            'timestamp': customer.locale,
                            'timezone': customer.timezone,
                            'profile_pic': customer.profile_pic,
                            'gender': customer.gender,
                            'user_id': sender,
                            '_id': bodyC.fbsession.user_id,

                          }, //this is the facebook id of a customer
                          'pageid': fbpage,
                          'companyid': customerobj.companyid,
                          'requesttime': customerobj.requesttime,
                          'status': bodyC.fbsession.status == 'resolved' ? 'assigned' : bodyC.fbsession.status,
                          'agent_ids': bodyC.fbsession.agent_ids,


                        }

                        var readstatusRequestPayload = {
                          group_id: fbpage._id,
                          company_id: customerobj.companyid,
                          message_id: body._id,
                          request_id: fbpage.pageid +'$'+ customerobj.user_id,
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
                            //console.log(responseReadStatus);
                            //console.log(bodyReadStatus);

                          });

                        console.log('socketsession is');
                        console.log(socketsession);
                        socket.getfbchat({chatobj, socketsession});
                        sendpushToTeamAgents({
                          'customerid': customerobj.user_id,
                          'msgid': body._id,
                          'type': 'fbchat',
                          'status': 'New message from Facebook Customer'
                        }, 'New message from Facebook Customer', fbpage._id, fbpageteams, teamagents);

                        // sendpushToAllAgents({'customerid' : customerobj.user_id,'msgid':body._id,'type':'fbchat','status':'New message from Facebook Customer'},'New message from Facebook Customer');

                        // update fbsession status if marked resolved

                        if (bodyC.fbsession && bodyC.fbsession.status == 'resolved') {
                          var customerobjS = {
                            companyid: bodyC.fbsession.companyid,
                            pageid: bodyC.fbsession.pageid,
                            user_id: bodyC.fbsession.user_id,
                            status: 'assigned',
                          }
                          //call kiboengage API to save customer
                          var optionsS = {
                            url: `${baseURL}/api/fbsessions/fbupdatestatus`,
                            headers: headers,
                            json: customerobjS,

                          };


                          function callbackS(error, response, bodyS) {
                            console.log(error);
                            console.log(bodyS);
                            if (!error) {
                              //send push notification to all agents
                              console.log('sending push to all agents');
                              //  sendpushToAllAgents({'customerid' : customerobj.user_id,'msgid':body._id,'type':'fbchat','status':'New message from Facebook Customer'},'New message from Facebook Customer');

                            }
                            else {
                              return res.status(422).json({statusCode: 422, data: error});
                            }
                          }

                          request.post(optionsS, callbackS);

                          //return res.status(201).json({status:"success"});
                        }
                      }
                      else {
                        return res.status(422).json({statusCode: 422, data: error});

                      }

                    }

                    request.post(optionsChat, callbackChat);
                  }
                }
              }

              request.post(optionsC, callbackC);


            }
            else {
              return res.status(422).json({statusCode: 422, data: error});
            }

          }

          request.get(optionsG, callbackG);

          //return res.status(201);//.json(JSON.parse(body));
        }
        else {
          //      return res.status(422).json({statusCode : 422 ,data:error});

        }

      }

      request.post(options, callback);
    }
  }
  res.sendStatus(200)
}


function sendpushToAgent(pageid, fbteams, teamagents, agentid) {
  //fbteams
  //team agents
  //pageid is _id
  console.log('showSession called');
  var is_agent_in_team = false;

  if (fbteams.length > 0) {
    var get_teams_assigned_to_page = fbteams.filter((c) => c.pageid._id == pageid);
    for (var i = 0; i < get_teams_assigned_to_page.length; i++) {
      for (var j = 0; j < teamagents.length; j++) {
        if (get_teams_assigned_to_page[i].teamid._id == teamagents[j].groupid._id && teamagents[j].agentid._id == agentid) {
          is_agent_in_team = true;
          break;

        }
      }
      if (is_agent_in_team == true) {
        break;
      }

    }
  }
  return is_agent_in_team;
}

function sendpushToTeamAgents(body, pushTitle, pageid, fbpageteams, teamagents) {
  console.log('send push to fbteamsAndteamagents agents');
  if (fbpageteams && teamagents) {
    var fbteams = fbpageteams;
    var teamagents = teamagents;
    console.log(fbteams.length);
    console.log(teamagents.length);
    var payload = {
      data: body,
      badge: 0
    };

    var headers = {
      'kibo-app-id': '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
      'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
      'kibo-client-id': 'cd89f71715f2014725163952',

    }
    var options = {
      url: `${baseURL}/api/users/allagents/`,
      rejectUnauthorized: false,
      headers,

    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var agentlist = info.agents;
        for (var i = 0; i < agentlist.length; i++) {
          var obj = agentlist[i];
          //           console.log('----- obj is');
          //  console.log(obj);
          //         console.log(obj.email);
          if (sendpushToAgent(pageid, fbteams, teamagents, obj._id)) {
            console.log('SENDING PUSH notification TO ' + obj.email);
            sendPushNotification('Agent-' + obj.email, payload, pushTitle);
          }

        }

      }

    }

    request.get(options, callback);
  }
}
// send push to all agents

function sendpushToAllAgents(body, pushTitle) {
  console.log('send push to all agents');
  var payload = {
    data: body,
    badge: 0
  };

  var headers = {
    'kibo-app-id': '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
    'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
    'kibo-client-id': 'cd89f71715f2014725163952',

  }
  var options = {
    url: `${baseURL}/api/users/allagents/`,
    rejectUnauthorized: false,
    headers,

  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      var agentlist = info.agents;
      for (var i = 0; i < agentlist.length; i++) {
        var obj = agentlist[i];
        //           console.log('----- obj is');
        //  console.log(obj);
        //         console.log(obj.email);
        sendPushNotification('Agent-' + obj.email, payload, pushTitle);
      }

    }

    else {
      //  return res.status(422).json({message:error});
    }
  }

  request.get(options, callback);
}


//for mobile agents
function sendPushNotification(tagname, payload, alertmessage) {
  //console.log('sendPushNotification for message status update is called');
  // console.log(tagname);
  // console.log(payload);
  //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
  var iOSMessage = {
    alert: alertmessage,
    sound: 'UILocalNotificationDefaultSoundName',
    badge: payload.badge,
    payload: payload
  };
  var androidMessage = {
    to: tagname,
    priority: "high",
    data: {
      message: payload
    }
  }
  notificationHubService.gcm.send(tagname, androidMessage, function (error) {
    if (!error) {
      console.log('Azure push notification sent to Android using GCM Module, client number : ' + tagname);
    } else {
      console.log('Azure push notification error : ' + JSON.stringify(error));
    }
  });
  notificationHubService.apns.send(tagname, iOSMessage, function (error) {
    if (!error) {
      console.log('Azure push notification sent to iOS using GCM Module, client number : ' + tagname);
      // console.log(iOSMessage);
    } else {
      console.log('Azure push notification error : ' + JSON.stringify(error));
    }
  });


}


export function getfbCustomers(req, res) {
  console.log('getfbCustomers');
  var token = req.headers.authorization;

  var options = {
    url: `${baseURL}/api/fbCustomers/`,
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,

    },


  };

  function callback(error, response, body) {

    if (!error) {

      return res.status(201).json(JSON.parse(body));
    }
    else {
      return res.status(422).json({statusCode: 422, data: error});

    }

  }

  request.get(options, callback);

}

export function getfbSessions(req, res) {
  console.log('getfbSessions');
  var token = req.headers.authorization;

  var options = {
    url: `${baseURL}/api/fbsessions/`,
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,

    },


  };

  function callback(error, response, body) {


    if (!error) {
      return res.status(201).json(JSON.parse(body));
    }
    else {
      return res.status(422).json({statusCode: 422, data: error});

    }

  }

  request.get(options, callback);

}


export function getfbChats(req, res) {
  //console.log('create Response is called');
  var token = req.headers.authorization;

  var options = {
    url: `${baseURL}/api/fbmessages/`,
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,

    },


  };

  function callback(error, response, body) {

    //   console.log(body);
    //   console.log(error)
    if (!error) {
      return res.status(201).json(JSON.parse(body));
    }
    else {
      return res.status(422).json({statusCode: 422, data: error});

    }

  }

  request.get(options, callback);

}


export function sendTextMessage(req, res) {
  console.log('send text to customer is called');
  console.log(req.body);
  logger.serverLog('info', 'Send text to Facebook customer ' + JSON.stringify(req.body));
  /*
   senderid: this.props.userdetails._id,
   recipientid:this.props.senderid,
   companyid:this.props.userdetails.uniqueid,
   timestamp:Date.now(),
   message:{
   mid:uniqueid,
   seq:1,
   text:this.state.value,
   }
   pageid:
   */

  // get page token first

  var options = {
    url: `${baseURL}/api/fbpages/getpage`,
    headers: headers,

    form: {
      'pageid': req.body.pageid,
    }

  };

  function callback(error, response, body) {
    console.log(body);
    console.log(error);
    if (!error) {

      var fbpage = JSON.parse(body);
      let token = fbpage.pageToken;
      let companyid = fbpage.companyid;
      console.log('token is ' + token);
      let messageData;
      if (req.body.message.text) {
        messageData = {text: req.body.message.text}
      }
      else {
        messageData = {attachment: req.body.message.attachments[0]};
        console.log('messageData');
        console.log(messageData);

      }
      var chatobj = req.body;
      console.log(chatobj);

      var optionsChat = {
        url: `${baseURL}/api/fbmessages/`,
        rejectUnauthorized: false,
        headers: headers,
        json: chatobj,

      };

      function callbackChat(error, response, body) {
        console.log(body);
        console.log(error);
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
              recipient: {id: req.body.recipientid},
              message: messageData,
            }
          }, function (error, response, body) {
            console.log('sending message is ack');
            console.log(body);

            if (!error) {
              res.json({status: 'success'});
            }
            else {
              res.json({status: 'failure'});
            }

          }
        )
      }

      request.post(optionsChat, callbackChat);


    }

    else {
      console.log('Error: ', error)
    }

  }

  request.post(options, callback);


}


/*** used by customer to send file to agent****/
export function uploadchatfilefb(req, res) {
  console.log('uploadchatfile called');
  console.log(req);
  console.log('req body');
  // console.log(req.body)
  if (req.body) {
    console.log(req.body.chatmsg);
    console.log(req.files);

    var obj = JSON.parse(req.body.chatmsg)
    console.log(obj);
    // var token = req.headers.authorization;

    //var today = new Date();
    // var uid = crypto.randomBytes(5).toString('hex');
    // var serverPath = '/' + 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate();
    //  serverPath += '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
    var serverPath = obj.message.mid;
    var fext = req.files.file.name.split('.');
    serverPath += '.' + fext[fext.length - 1];
    console.log('__dirname');
    console.log(__dirname);
    console.log(req.headers);
    var dir = path.resolve(__dirname, '../../static/');
    console.log('req.files.file.size');
    console.log(req.files.file.size);
    if (req.files.file.size == 0) return res.send('No file submitted');

    fs.readFile(req.files.file.path, function (err, data) {
      var pathNew = dir + "/userfiles/" + serverPath;
      req.body.path = serverPath;
      if (!err) {
        fs.writeFile(pathNew, data, function (err) {
          if (!err) {
            console.log('writing file');
            console.log(obj);
            console.log(obj.message.attachments);
            obj.message.attachments[0].payload.url = 'https://kiboengage.kibosupport.com/userfiles/' + serverPath;
            console.log(obj);
            var options = {
              url: `${baseURL}/api/fbpages/getpage`,
              headers: headers,

              form: {
                'pageid': obj.pageid,
              }

            };

            function callback(error, response, body) {
              console.log(body);
              console.log(error);
              if (!error) {

                var fbpage = JSON.parse(body);
                let token = fbpage.pageToken;
                let companyid = fbpage.companyid;
                console.log('token is ' + token);

                var chatobj = obj;
                console.log(chatobj);

                var optionsChat = {
                  url: `${baseURL}/api/fbmessages/`,
                  rejectUnauthorized: false,
                  headers: headers,
                  json: chatobj,

                };

                function callbackChat(error, response, body) {
                  console.log(body);
                  console.log(error);

                  var ftype = '';
                  if (req.files.file.type.split('/')[0] == 'image') {
                    ftype = 'image';

                  }
                  else if (req.files.file.type.split('/')[0] == 'audio') {
                    ftype = 'audio';
                  }
                  else if (req.files.file.type.split('/')[0] == 'video') {
                    ftype = 'video';
                  }
                  else {
                    ftype = "file";
                  }
                  var messageobj = {
                    'attachment': {
                      'type': ftype,
                      'payload': {
                        'url': chatobj.message.attachments[0].payload.url,
                      }
                    }
                  }
                  console.log(messageobj);
                  console.log('token is');
                  console.log(token);
                  request({
                      url: 'https://graph.facebook.com/v2.6/me/messages',
                      qs: {access_token: token},
                      method: 'POST',
                      json: {
                        recipient: {id: chatobj.recipientid},
                        message: messageobj,
                      }
                    }, function (error, response, body) {

                      console.log('fb message');
                      console.log(body);
                      if (!error) {
                        socket.getfileChatfromAgent({chatobj});

                        res.json({status: 'success', chatmsg: chatobj});
                      }
                      else {
                        res.json({status: 'failure'});
                      }

                    }
                  )
                }

                request.post(optionsChat, callbackChat);

              }

              else {
                console.log('Error: ', error)
                res.json({status: 'failure'});
              }

            }

            request.post(options, callback);
          }
          else {
            console.log('error in file writing');
            console.log(err);
            res.json({status: 'failure'});
          }
        });
      }
      else {
        console.log('error in reading file');
        res.json({status: 'failure'});
      }
    });

  }

  else {
    res.json({status: 'failure'});
  }


}


export function assignToAgentFB(req, res) {
  console.log('assignToAgentFB is called');
  console.log(req.body);
  var token = req.headers.authorization;


  var options = {
    url: `${baseURL}/api/fbsessions/fbassignToAgent`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    rejectUnauthorized: false,
    json: req.body


  };

  function callback(error, response, body) {
    //console.log(error);
    console.log(response.statusCode);

    console.log(body);

    if (!error && response.statusCode == 200) {
      //console.log(body)
      //send push notification to assigned agents
      var agentlist = req.body.agentemail;
      var payload = {
        data: {

          pageid: req.body.pageid,
          userid: req.body.userid,
          type: 'fb_chat_assigned'

        },
        badge: 0
      };
      for (var i = 0; i < agentlist.length; i++) {
        console.log('----- obj is');
        console.log(agentlist[i]);

        sendPushNotification('Agent-' + agentlist[i], payload, 'You are assigned a new session');
      }
      return res.status(200).json({statusCode: 201, message: 'success'});
    }
    else {
      //res.sendStatus(422);
      return res.status(422).json({statusCode: 422, message: 'failed'});

    }
  }

  request.post(options, callback);

}


export function resolvechatsessionfb(req, res) {
  console.log('resolvesession is called');
  console.log(req.body);
  var token = req.headers.authorization;


  var options = {
    url: `${baseURL}/api/fbsessions/fbresolveSession`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    rejectUnauthorized: false,
    json: req.body


  };

  function callback(error, response, body) {
    console.log(error);
    console.log(response.statusCode);
    console.log(body);

    if (!error && response.statusCode == 200) {
      //console.log(body)
      // inform mobile agents through push notification
      //send push notification to all agents
      sendpushToAllAgents({
        'pageid': req.body.pageid,
        'user_id': req.body.user_id,
        'type': 'fbchat_resolved',
        'status': 'Resolve Chat Session'
      }, 'Resolve Chat Session');

      return res.status(200).json({statusCode: 201, message: 'success'});
    }
    else {
      res.sendStatus(422);
      return res.status(422).json({statusCode: 422, message: 'failed'});

    }
  }

  request.post(options, callback);

}


export function fetchurlmeta(req, res) {
  var url = req.body.url;
  console.log(url);
  og(url, function (err, meta) {
    console.log(meta);
    res.status(200).json({'url_meta': meta});
  });

}


function linkify(text) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlRegex, function (url) {
    logger.serverLog('info', 'urlfound ' + url);

    return url;
  });
}
