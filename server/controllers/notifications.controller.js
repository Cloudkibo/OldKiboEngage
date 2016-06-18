import Post from '../models/post';
import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
  'content-type' : 'application/x-www-form-urlencoded'
 }

var baseURL = `https://api.kibosupport.com`


/************************* Channel APIS ************************************/
export function createNotification(req, res) {
  console.log('create Notification is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.notification);
  var customers = req.body.customers;
  console.log(customers);
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
          sendemail(customers,body);
          res.json({ notification: body });
          // res.sendStatus(200);
       //     return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
         res.sendStatus(422);
         //   return res.status(422).json({statusCode : 422 ,message:'failed'}); 
   
       }        
     

   }
        request.post(options, callback);
   
  }


function sendemail(customers,body){
console.log(customers);  
console.log('Length of customers : ' + customers.length);
var emailArray = [];
var emailBody = body.description;
var emailSub = body.title;
for(var i = 0;i<customers.length;i++){
      emailArray.push(customers[i].email);
}

for(var i=0;i<emailArray.length;i++){
  sendemailNotification(emailArray[i],emailSub,emailBody);
}
}

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
      console.log(body);
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
        console.log(body);
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