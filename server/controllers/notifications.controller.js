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
  var options = {
      url: `${baseURL}/api/notifications/`,
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
       if(response.statusCode == 201)
       {
          
           res.sendStatus(200);
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

/*export function editChannel(req, res) {
  console.log('edit Channel is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.channel);
  var id = req.body.channel._id;
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