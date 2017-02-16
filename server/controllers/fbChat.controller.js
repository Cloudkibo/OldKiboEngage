import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
import Buffer from 'Buffer';
import path from 'path';
import fs from 'fs';

var logger = require('../logger/logger');
var socket = require('../routes/socket');
var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
 'content-type' : 'application/json'
 }
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagepushns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=qEtmHxK7uu4/vBxLfUZKgATa+h5z2MLI63Soky0QNxk=');
var notificationHubService2 = azure.createNotificationHubService('KiboEngageProductionHub','Endpoint=sb://kiboengageproductionhub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=Hc1qWqbkLk4oGYJ9dN9vexUsIKk8hOeja5sEte89n9s=');



// notification hub for Agents
var notificationHubService3 = azure.createNotificationHubService('KiboEngageTestHub','Endpoint=sb://kiboengagetest.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=12mu5jrcNfUlKSG5k8Uy19WMDJCxZQmhGCpa9SozHm8=');

var baseURL = `https://api.kibosupport.com`
// facebook webhook
//ßconst token = "EAAPwdwgvYOMBAOsSCEbRiBZB403aWrJ2FtFXd3wfsmEnsZAGD2My1uX6THyegD69Wx2HlkhMyWlfNZBNEZBlTgiqZBBr41SHiHAEZAA13J3GHDZBpZB0ySZAsFkpcVInpdghdQ0ba9y2hOfK6HfniJ3tm56r1BnwBGQ65gZAzWQaiKAgZDZD";

export function verifyhook(req,res) {
    if (req.query['hub.verify_token'] === 'VERIFY_ME') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
}

export function chatwebhook(req, res) {
 
    console.log('chat webhook is called');
    // call api to fetch page info from pageid
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        console.log(event);
        let sender = event.sender.id;
        let page = event.recipient.id;
        console.log('page id is' + page);
         var options = {
				 	  url: `${baseURL}/api/fbpages/getpage`,
				      headers : headers,
				    
				      form:{
				        'pageid':page,
				      }

			    };

	     function callback(error, response, body) {
	     		  console.log(body);
	     		  console.log(error);
			      var fbpage = JSON.parse(body);
			      let token = fbpage.pageToken;
			      let companyid = fbpage.companyid;
			      console.log('token is ' + token);
			      if(!error) {
			      		// fetch customer details
			      		    var optionsG = {
								        url: 'https://graph.facebook.com/v2.6/'+sender+'?access_token='+token,
								        qs: {access_token:token},
								        method: 'GET'
								        
								    };

								function callbackG(error, response, body) {
								        console.log(body);
								        let customer = JSON.parse(body);
								        if (!error) {
								           // call kiboengage api to save customer
								           var customerobj = {
								           	  'first_name' : customer.first_name,
											  'last_name' : customer.last_name,
											  'user_id':sender, //this is the facebook id of a customer
											   'email' : '',
											  'timestamp' : customer.locale,
											  'timezone' : customer.timezone,
											  'companyid' : companyid,
											  'gender' : customer.gender, 
								           }

								           console.log('customerobj obj is ');
								           console.log(customerobj);
								           //call kiboengage API to save customer
								            var optionsC = {
												 	  url: `${baseURL}/api/fbCustomers/`,
												      headers : headers,
												      json:customerobj,

											    };

			   							 function callbackC(error, response, body) {
			   							 
			   							 	console.log(body);
			   							 	console.log(error);
			   							 	if(!error){
			   							 		console.log('saving chat message');
			   							 		//call api to save chat message
			   							 		var chatobj = {
			   							 			  senderid : sender, // this is the user_id or page_id
													  recipientid : page,
													  timestamp : event.timestamp,
													  message: event.message,
													  companyid : companyid,
			   							 		}
												//call kiboengage API to save chat message
								            var optionsChat = {
												 	  url: `${baseURL}/api/fbmessages/`,
												      rejectUnauthorized : false,
												      headers : headers,
												      json:chatobj,

											    };

			   							 function callbackChat(error, response, body) {
			   							 	console.log(body);
			   							 	console.log(error);

			   							 	if(!error){

			   							 		// emit the chat message on socket
			   							 		 socket.getfbchat({chatobj,customerobj});
			   							 		//send push notification to all agents
            									sendpushToAllAgents({'customerid' : customerobj.user_id,'msgid':body._id},'New message from Facebook Customer');

			   							 		//return res.status(201).json({status:"success"});
			   							 	}
			   							 	else{
			   							 			return res.status(422).json({statusCode : 422 ,data:error});
								       
			   							 	}

			   							 	}
			   							 	request.post(optionsChat,callbackChat);
			   							 }
			   							}
			   							 request.post(optionsC,callbackC);

								        
								        }
								         else{
								           return res.status(422).json({statusCode : 422 ,data:error});
								        }

								    }
								    request.get(optionsG,callbackG);

			            //return res.status(201);//.json(JSON.parse(body));
			      }
			    else
			    {
			      return res.status(422).json({statusCode : 422 ,data:error});

			    }

   				}
        request.post(options, callback);
    }
    res.sendStatus(200)
}

// send push to all agents

function sendpushToAllAgents(body,pushTitle){
  console.log('send push to all agents');
  var payload = {
                              data: {
                                customerid : body.customerid,
                                msgid:body.msgid,
                                status : pushTitle,
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
                          //  console.log(obj);
                            console.log(obj.email);
                            sendPushNotification(obj.email,payload,pushTitle);
                   }

              }

              else
              {
             //  return res.status(422).json({message:error}); 
              }
     }
       request.get(options, callback);
}


//for mobile agents
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

   notificationHubService2.apns.send(tagname, iOSMessage, function(error){
    if(!error){
      console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
      console.log(iOSMessage);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });


   //for agents

   notificationHubService3.gcm.send(tagname, androidMessage, function(error){
    if(!error){
      console.log('Azure push notification sent to Android using GCM Module, client number : '+ tagname);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });
  notificationHubService3.apns.send(tagname, iOSMessage, function(error){
    if(!error){
      console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
      console.log(iOSMessage);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
    }
  });

}


