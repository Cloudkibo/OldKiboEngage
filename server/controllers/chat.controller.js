import Post from '../models/post';
import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
 
 }

var baseURL = `https://api.kibosupport.com`


/************************* Customer APIS ************************************/
export function createsession(req, res) {
  console.log('create session is called');
  
  console.log(req.body.session);
  console.log(req.body.session.length)
 if(req.body.session)
 {
  var options = {
      url: `${baseURL}/api/visitorcalls/createsession`,
      rejectUnauthorized : false,
      json: req.body.session
      
     
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

        console.log(body);
        
       if(!error && response.statusCode == 200)
       {
           console.log(body)
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


export function getsessions(req, res) {
  console.log('get session is called');
  
   var token = req.headers.authorization;
   var chat = [];
  var options = {
      url: `${baseURL}/api/visitorcalls/`,
      rejectUnauthorized : false,
       headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },
      
     
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

     //   console.log(body);
        
       if(!error && response.statusCode == 200)
       {
          var info = JSON.parse(body);

          for(var i in info){
              console.log(info[i].status)
            if(info[i].platform == "new"){

              console.log(info[i]);
              chat.push(info[i]);
            }
          }
              console.log(chat);
              return res.status(200).json(chat);
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
  console.log('create session is called');
  
  console.log(req.body.chat);
 
 if(req.body.chat)
 {
  var options = {
      url: `${baseURL}/api/userchats/create`,
      rejectUnauthorized : false,
      headers,
      json: req.body.chat,
      
     
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

        console.log(body);
        
       if(!error && response.statusCode == 201)
       {
           console.log(body)
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


