import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var Enumerable = require('linq');
var baseURL = `https://api.kibosupport.com`

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
