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
  
  console.log(req.body);
 
  var options = {
      url: `${baseURL}/api/visitorcalls/createsession`,
      rejectUnauthorized : false,
   //   headers, 
      json: req.body
      
     
    };
    console.log(options.json);
    
    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

        console.log(body);
        
       if(!error && response.statusCode == 201)
       {
          // res.sendStatus(200);
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


