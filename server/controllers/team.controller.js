import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var logger = require('../logger/logger');

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
 
 }
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagepushns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=qEtmHxK7uu4/vBxLfUZKgATa+h5z2MLI63Soky0QNxk=');
var notificationHubService2 = azure.createNotificationHubService('KiboEngageProductionHub','Endpoint=sb://kiboengageproductionhub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=Hc1qWqbkLk4oGYJ9dN9vexUsIKk8hOeja5sEte89n9s=');

var baseURL = `https://api.kibosupport.com`

export function getcustomerteams(req,res){
  console.log('get  customer team is called');
  console.log(req.body);
  
  var  headers =  {
             'kibo-app-id' : req.body.appid,
             'kibo-app-secret': req.body.appsecret,
             'kibo-client-id': req.body.clientid,
             
      }

  //console.log('get customer team');
      var options = {
      url: `${baseURL}/api/departments`,
      rejectUnauthorized : false,
      headers
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        ////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
    
}
export function getteams(req, res) {
  //console.log('get getteams is called');
  var token = req.headers.authorization;
  //console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/departments`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        ////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }


 export function createteam(req, res) {
  //console.log('create team is called');
  var token = req.headers.authorization;
  console.log('create team');
  console.log(req.body);
  logger.serverLog('info', 'This is body in createteam '+ JSON.stringify(req.body) );

  var options;
  if(req.body.deptagents){  
   options = {
      url: `${baseURL}/api/departments/kiboengage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      json: {
           'deptname' : req.body.deptname,
           'deptdescription': req.body.deptdescription,
           'deptagents' : req.body.deptagents,

          }
      
     
    };
  }
  else{
   options = {
      url: `${baseURL}/api/departments/kiboengage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      json: {
           'deptname' : req.body.deptname,
           'deptdescription': req.body.deptdescription,
          

          }
      
     
    };
 
  }
    function callback(error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
      if(!error  && response.statusCode == 200) {
        var info = body;
        console.log(body);
        //console.log(info.msg);
       //console.log(info.status);
       if(info.status == 'success')
       {
            // send push notification to mobile client
            var team = info.team;
            var ch = info.channel;
            sendPushNotification(team,"Teams","CreateTeam",token);
            sendPushNotification(ch,"Channels","CreateChannel",token);
           
            return res.status(200).json({statusCode : 200,message:info.msg});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:info.msg}); 
   
       }
    }
    else
    {
      return res.status(422).json({statusCode : 422 ,message:'Failed'}); 

    }

   }
        request.post(options, callback);
   
  }

export function getTeam(req, res) {
  //console.log('getTeam is called.');
  var token = req.headers.authorization;
  //console.log('token received is  : ' + token);
  //console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/departments/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                 }
     
    };
    function callback(error, response, body) {
    
      var info = JSON.parse(body);
      //  //console.log(info);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({team:info}); 
    
   }
   else{
    //console.log(error);
    res.status(422).json(info); 
   }
 }
        request.get(options, callback);
    
}


export function destroyTeam(req, res) {
  //console.log('destroyTeam is called.');
  var token = req.headers.authorization;
  //console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/departments/kiboengage/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    //console.log(response.statusCode);
    //console.log(error);
      var info = JSON.parse(body);

      //  //console.log(info.status);
        
      if(!error  && response.statusCode == 200) {
        var obj = {  
          _id:req.body.team._id,
          deptname: req.body.team.deptname,
          deptdescription: req.body.team.deptdescription}
        sendPushNotification(obj,"Teams","DeleteTeam",token);
        res.status(200).json({info}); 
    
   }
   else{
   // //console.log(error);
    res.status(422).json(info); 
   }
 }
    request.delete(options, callback);
    
}

export function editteam(req, res) {
  //console.log('edit team is called');
  var token = req.headers.authorization;
  //console.log(req.body.dept);
  //console.log(req.body.deptagents);
   var options = {
      url: `${baseURL}/api/departments/update/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },
      json: {
           'dept' : req.body.dept,
           'deptagents': req.body.deptagents,
          }
      
     
    };

    console.log('json body of edit team');
    console.log(options.json);
    console.log(options.headers);
    console.log(options.url);
    //console.log(options.json.dept);
    function callback(error, response, body) {
        //console.log(body);
    
      if(!error  && response.statusCode == 200) {
       if(body.status == 'success')
       {
            //send push notification to mobile customers
            sendPushNotification(req.body.dept,"Teams","EditTeam",token);
            return res.status(200).json({statusCode : 200,message:body.msg});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:body.msg}); 
   
       }
    }
    else
    {
      return res.status(422).json({statusCode : 422 ,message:error}); 

    }

   }
        request.post(options, callback);
   
  }
 
 //get my teams
 export function getmyuserteams(req, res) {
  var token = req.headers.authorization;
  var options = {
      url: `${baseURL}/api/departments/mydepartmentsKiboEngage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      console.log(error);
      console.log(body);
        if(!error  && response.statusCode == 200) {
       var info = JSON.parse(body);
       var totalDept = [];
       var isAgent = true;
       if(info.agentDept){
        isAgent = false;
        for(var i = 0;i< info.agentDept.length;i++){
          totalDept.push(info.agentDept[i].deptid);
        }
       }

       if(info.createdDept){
        isAgent = false;
         for(var i = 0;i< info.createdDept.length;i++){
          totalDept.push(info.createdDept[i]);
        }
       }

      if(isAgent == false){ 
      return res.status(200).json({depts:totalDept});
    }
    else{
     return res.status(200).json({depts:info}); 
    }
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }



//for mobile customers
function sendPushNotification(data,tablename,operation,token){
  console.log('sendPushNotification for channels is called');
   var options = {
                url: `${baseURL}/api/customers/`,
                rejectUnauthorized : false,
                headers :  {
                           'Authorization': `Bearer ${token}`
                           }


              };
              function callback(error1, response, body1) {
                 //console.log(body);
                 //console.log(error);
                var customers = JSON.parse(body1);
                if(!error1  && response.statusCode == 200) {
                             var payload = {
                                  data: {
                                    obj:data,
                                    tablename : tablename,
                                    operation : operation,
                                  },
                                  badge: 0
                                };

                            //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
                            for(var i=0;i<customers.length;i++){

                              var tagname = customers[i].customerID;
                              var iOSMessage = {
                                alert : operation,
                                sound : 'UILocalNotificationDefaultSoundName',
                                badge : payload.badge,
                                payload : payload,
                                'content-available' : true
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

                          }
                        }
                        request.get(options, callback);



}



