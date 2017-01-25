import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var crypto = require('crypto');

var Enumerable = require('linq');
var baseURL = `https://api.kibosupport.com`
var ss = require('../routes/socket');
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagepushns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=qEtmHxK7uu4/vBxLfUZKgATa+h5z2MLI63Soky0QNxk=');
var notificationHubService2 = azure.createNotificationHubService('KiboEngageProductionHub','Endpoint=sb://kiboengageproductionhub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=Hc1qWqbkLk4oGYJ9dN9vexUsIKk8hOeja5sEte89n9s=');
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
           res.sendStatus(422);
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
  //console.log('assignToAgent is called');
  //console.log(req.body);
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

        var linq = Enumerable.from(body);
        //console.log(linq);
        var result =
            linq.groupBy(function(x){return x.request_id;})
            .select(function(x){return { request_id:x.key(),Value:x.last() };})
            .toArray();
        //console.log(result);
        var info = result;
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



// endpoint called by customer (web or mobile)
export function getChatMessage(req, res) {
    console.log('getChatMessage is called');
    var chat   = req.body;
    console.log(chat);
    ss.getchat(req.body);
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

   notificationHubService2.apns.send(tagname, iOSMessage, function(error){
    if(!error){
      console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
      console.log(iOSMessage);
    } else {
      console.log('Azure push notification error : '+ JSON.stringify(error));
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

              sendPushNotification(req.body.customerid,payload,'status update');
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
                      sendPushNotification(req.body.to,payload,msg);
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