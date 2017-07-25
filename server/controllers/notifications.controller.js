import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var logger = require('../logger/logger');
var sizeof = require('object-sizeof');

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
  'content-type' : 'application/x-www-form-urlencoded'
 }

var baseURL = `https://api.kibosupport.com`
var azure = require('azure-sb');
// notification hub for Agents
var notificationHubService = azure.createNotificationHubService('kiboengagetesthub','Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=TDM/hTOZxsgXq7hFcvO3/cJ3PeoQCRD82COpO7hwWbM=');
//for ios production
var notificationHubService1 = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagens.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=B2do9BVVK6ca1OQsJWQIE+6WlFfcGuWjr+280C+tIVY=');

/************************* Channel APIS ************************************/
export function createNotification(req, res) {
  console.log('create Notification is called');
  console.log(req.body);
  logger.serverLog('info', 'This is body in createNotification '+ JSON.stringify(req.body) );

  var token = req.headers.authorization;
 // console.log(req.body);
  //console.log(req.body.notification);
  //var customers = req.body.customers;
  //console.log(customers);
  var options = {
      url: `${baseURL}/api/notifications`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },

      json: req.body.notification
      
     
    };
    
    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

        var info = body;
        console.log(info);
       if(!error && response.statusCode == 201)
       {
          
           res.status(200).json({statusCode : 201,message:'success'});
           sendemail(body,token);
         
          
       }
       else
       {
          res.status(422).json({statusCode : 422 ,message:'failed'}); 
   
       }        
     

   }
        request.post(options, callback);
   
  }





export function resendNotification(req, res) {
  console.log('resend Notification is called');
  console.log(req.body);
  logger.serverLog('info', 'This is body in resendNotification '+ JSON.stringify(req.body) );

  
  var token = req.headers.authorization;
 // console.log(req.body);
  console.log(req.body.notification);
  
  //console.log(customers);
  
  res.status(200).json({status:'success'});
  sendemail(req.body.notification,token);
  
  }

function sendemail(body,token){

          var options = {
                url: `${baseURL}/api/customers/`,
                rejectUnauthorized : false,
                headers :  {
                           'Authorization': `Bearer ${token}`
                           }


              };
              function callback(error, response, body1) {
                 ////console.log(body);
                 //console.log(error);

                if(!error  && response.statusCode == 200) {
                  var customers = JSON.parse(body1);
                  console.log(customers);  
                  console.log('Length of customers : ' + customers.length);
                  var emailArray = []; // for holding web customers
                  var pushNotificationArray = [] ;//for holding mobile customers
                  var emailBody = body.description;
                  var emailSub = body.title;
                  var emailSend = 0;
                  var pushSend = 0;
                  for(var i = 0;i<customers.length;i++){
                        if(customers[i].isMobileClient == 'false')
                            emailArray.push(customers[i].email);

                        else{
                          pushNotificationArray.push('Client-'+customers[i].customerID);//we are using _id as a tagname
                        }

                  }

                  for(var i=0;i<emailArray.length;i++){
                    sendemailNotification(emailArray[i],emailSub,emailBody);
                  }

                  for(var i=0;i<pushNotificationArray.length;i++){
                    //sendPushNotification(pushNotificationArray[i],emailBody,emailSub);
                    sendPushNotification(pushNotificationArray[i],body);
                  }
                  
              }

           
            }
    request.get(options, callback);


//sendPushNotification('customerA',body);
}


//for mobile customers
function sendPushNotification(tagname,body){
  //console.log(body)
  console.log('size of notification');
  console.log(sizeof(body));
  var sizeofbody = sizeof(body); //returns bytes
  var payload;
 
  if(sizeofbody < 2048){
    body['bool_fetch'] = 'false';
    //console.log(body)
     var payload = {
        data: body,
        badge: 0
      };
  }

  else{
     payload = {
        data: {
          uniqueid: body.uniqueid,
          bool_fetch : "true",
          title : body.title,
        },
        badge: 0
      };
    }
  
  

  //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
  var iOSMessage = {
    alert : payload.data.title,
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

//for web customers
function sendemailNotification(emailid,emailSub,emailBody){
console.log('Email address : ' + emailid);
var sendgrid = require("sendgrid")('cloudkibo','cl0udk1b0');
var email     = new sendgrid.Email({
              to:       emailid,
              from:     'support@cloudkibo.com',
              subject:   'KiboEngage Notification : ' + emailSub ,
              text:     emailBody
            });


email.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
              '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
              '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
              '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
              '<p style="color: #ffffff">Notification : ' + emailSub +' </p> </td></tr> </table> </td> </tr> </table> ' +
              '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
              '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
              '<tr> <td class="wrapper last"> <p> Hello, <br> ' + emailBody +'<br><br>  </p><!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
              '</table> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
              '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')


sendgrid.send(email, function(err, json) {
              if (err) { return console.log(err); }
              //console.log(json);
            });


}
export function getnotifications(req, res) {
  console.log('get getnotifications is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/notifications/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      //console.log(body);
       console.log(error);
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }


export function destroyNotification(req, res) {
  console.log('destroyNotification is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/notifications/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    console.log(response.statusCode);
    console.log(error);
      if(!error  && response.statusCode == 204) {
        res.sendStatus(200); 
    
   }
   else{
    console.log(error);
     res.sendStatus(422);  
   }
 }
    request.delete(options, callback);
    
}

/*export function editNotification(req, res) {
  console.log('edit Notification is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.notification);
  var id = req.body.notification._id;
  console.log(id);
   var options = {
      url: `${baseURL}/api/messagechannels/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },
      json: req.body.channel
      
     
    };
    
    function callback(error, response, body) {
        //console.log(body);
        console.log(error)
      if(!error  && response.statusCode == 200) {
      
            return res.status(200).json({statusCode : 200,body});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body}); 

    }

   }
        request.put(options, callback);
   
  }
*/