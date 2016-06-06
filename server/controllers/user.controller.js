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
//var baseURL = `https://192.168.8.101:8443`
export function getlogin (req,res) {
  console.log('Login api is called.');

  if (!req.body.email || !req.body.password || !req.body.website ) {
    return res.status(403).end();
  }
  else
  {
    var user = req.body;
    var options = {
      url: `${baseURL}/auth/local`,
      rejectUnauthorized : false,
      headers:headers,
      form: {
        'email'     :user.email,
        'password'   : user.password,
        'website' : user.website
      }
    };
    function callback(error, response, body) {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log('api calling succeed')
       // console.log(info)
        return res.status(response.statusCode).send({token:info,statusCode:200});

      }
      else if(!error && response.statusCode == 404)
      {
        res.status(404).send({message:"This domain is not registered with us or your account does not belong to this domain", user: user,statusCode:501});
      }
      else if (!error && response.statusCode == 401) {
            res.status(404).send({message:"The username or password don't match", user: user,statusCode:401});
      }
      else if (response.statusCode == 501) {
        res.status(501).send({message:"Internal server error. Please inform admin.", user: user,statusCode:501});
      }

      else
      {
        console.log(response.error);

        res.status(501).send({message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);
  }
};


export function signupUser(req, res) {
  console.log('i am called');
  if (!req.body.firstname || !req.body.password || !req.body.lastname || !req.body.phone ||!req.body.companyName ||!req.body.website ||!req.body.email ) {
    return res.status(403).end();
  }
  else
  {
     var user = req.body;
     var options = {
      url: `${baseURL}/api/users/kiboengage`,
      rejectUnauthorized : false,
      headers:headers,
      form: {
            'firstname' :user.firstname,
            'lastname'  :user.lastname,
            'email'     :user.email,
            'phone'     :user.phone,
            'password'   : user.password,
            'companyName':user.companyName,
            'website' : user.website,
            'token' : user.token

          }
    };
    console.log(options.form);
    function callback(error, response, body) {

      var validationErr =[];
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log('api calling succeed')
       // console.log(info)
        validationErr.push('Your account is created successfully')
        return res.json({signup:{ validationErrs :validationErr ,token : info,statusCode : response.statusCode}});

      }
       else if (response.statusCode == 422) {
       console.log('validation errors');
       var errs = JSON.parse(body).errors;

       for(var err in errs)
       {

       validationErr.push(errs[err].message);
       }
       console.log(validationErr);
       return res.json({signup:{ validationErrs : validationErr ,token : null,statusCode : response.statusCode}});
      }
      else
      {
        console.log(error);
        validationErr.push(error)
        return res.json({signup:{ validationErrs :validationErr ,token : null,statusCode : response.statusCode}});

      }
    }

    request.post(options, callback);
  }


}




export function getuser(req, res) {
  console.log('get user is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/users/me`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      if(response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(response.statusCode)
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }




export function getgroups(req, res) {
  console.log('get getgroups is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
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
        //console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }

export function getagents(req, res) {
  console.log('get deptagent is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/users/allagents`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.agents.length)
      //  console.log(info.agents);
        //console.log(info);
      return res.status(200).json(info.agents);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }

  export function deptagents(req, res) {
  console.log('get deptagents is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/deptagents/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
       // console.log(info)
       
        //console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }


export function creategroup(req, res) {
  console.log('create group is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  
   var options = {
      url: `${baseURL}/api/departments`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      form: {
           'deptname' : req.body.deptname,
           'deptdescription': req.body.deptdescription

          }
      
     
    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.msg);
       console.log(info.status);
       if(info.status == 'success')
       {
            return res.status(200).json({statusCode : 200,message:info.msg});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:info.msg}); 
   
       }
    }
    else
    {
      return res.status(422).json({statusCode : 422 ,message:info.msg}); 

    }

   }
        request.post(options, callback);
   
  }

export function getGroup(req, res) {
  console.log('getGroup is called.');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  console.log(req.query.id);
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
      //  console.log(info);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({group:info}); 
    
   }
   else{
    console.log(error);
    res.status(422).json(info); 
   }
 }
        request.get(options, callback);
    
}


export function destroyGroup(req, res) {
  console.log('destroyGroup is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/departments/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    console.log(response.statusCode);
    console.log(error);
      var info = JSON.parse(body);

      //  console.log(info.status);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({info}); 
    
   }
   else{
   // console.log(error);
    res.status(422).json(info); 
   }
 }
    request.delete(options, callback);
    
}



export function deleteAgent(req, res) {
  console.log('deleteAgent is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/users/deleteagent/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    console.log(response.statusCode);
    console.log(error);
      var info = JSON.parse(body);

      //  console.log(info.status);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({info}); 
    
   }
   else{
   // console.log(error);
    res.status(422).json(info); 
   }
 }
    request.post(options, callback);
    
}


export function editgroup(req, res) {
  console.log('edit group is called');
  var token = req.headers.authorization;
  console.log(req.body.dept);
  console.log(req.body.deptagents);
  
  console.log(deptagents);
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
    console.log(options.json.dept);
    function callback(error, response, body) {
        console.log(body);
    
      if(!error  && response.statusCode == 200) {
       if(body.status == 'success')
       {
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


export function editagent(req, res) {
  console.log('edit agent is called');
  var token = req.headers.authorization;
  console.log(req.body);
   var options = {
      url: `${baseURL}/api/users/updaterole/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      form: {
           personid : req.body.personid,
           role : req.body.role

          }
      
     
    };
    function callback(error, response, body) {
        console.log(error);
        var info = JSON.parse(body);
        console.log(info.msg);
       console.log(info.status);
    
      if(!error  && response.statusCode == 200) {
       if(info.status == 'success')
       {
            return res.status(200).json({statusCode : 200,message:info.status});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:info.status}); 
   
       }
    }
   

   }
        request.post(options, callback);
   
  }




export function inviteAgent(req, res) {
  console.log('invite agent is called');
  var token = req.headers.authorization;
  console.log(req.body);
   var options = {
      url: `${baseURL}/api/tempaccounts/kiboengage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      form: {
          email : req.body.email

          }
      
     
    };
    function callback(error, response, body) {
        console.log(error);
        var info = JSON.parse(body);
        console.log(info.msg);
       console.log(info.status);
    
      if(!error  && response.statusCode == 200) {
       if(info.status == 'success')
       {
            return res.status(200).json({statusCode : 200,message:info.msg});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:info.msg}); 
   
       }
    }
   

   }
        request.post(options, callback);
   
  }


/************************* Channel APIS ************************************/
export function createChannel(req, res) {
  console.log('create Channel is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.channel);
   var options = {
      url: `${baseURL}/api/messagechannels/`,
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
        request.post(options, callback);
   
  }


export function getchannels(req, res) {
  console.log('get getchannels is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/messagechannels`,
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


export function destroyChannel(req, res) {
  console.log('destroyChannel is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/messagechannels/${id}`,
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

export function editChannel(req, res) {
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












/************************* Canned Response APIs *********************************/
export function createResponse(req, res) {
  console.log('create Response is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.response);
   var options = {
      url: `${baseURL}/api/shortcuts/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },
      json: req.body.response
      
     
    };
    
    function callback(error, response, body) {
        console.log(body);
        console.log(error)
      if(!error  && response.statusCode == 201) {
            return res.status(200).json({statusCode : 200,body});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body}); 

    }

   }
        request.post(options, callback);
   
  }


export function getresponses(req, res) {
  console.log('get getresponses is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/shortcuts/`,
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


export function destroyResponse(req, res) {
  console.log('destroyResponse is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/shortcuts/${id}`,
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

export function editResponse(req, res) {
  console.log('edit Response is called');
  var token = req.headers.authorization;
  console.log(req.body);
  console.log(req.body.response);
  var id = req.body.response._id;
  console.log(id);
   var options = {
      url: `${baseURL}/api/shortcuts/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,
                
                 },
      json: req.body.response
      
     
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


export function invitetoken(req,res){

  console.log('invitetoken is called');
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/inviteagenttokens?id=${id}`,
      rejectUnauthorized : false,
          
    };
    
    function callback(error, response, body) {
        console.log(body);
        console.log(response.statusCode);
        console.log(error);
        console.log(body.length);
        var parsedJSON = JSON.parse(body);
        console.log(parsedJSON);
       for (var i=0;i<parsedJSON.length;i++) {
            console.log(parsedJSON[i].email);
         }
        
      if(!error && body.length == 0)
      {
         return res.status(200).json({statusCode : 422 ,error});
      }  
      else if(!error && body.length != 0) {
            

            return res.status(200).json({statusCode : 200 ,body:parsedJSON[0]});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,error}); 

    }

   }
        request.get(options, callback);
}



export function verifytoken(req,res){

  console.log('verifytoken is called');
  console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/verificationtokens/kiboengage/${id}`,
      rejectUnauthorized : false,
          
    };
    
    function callback(error, response, body) {
      console.log(body);

      if(!error && response.status == 'success')
      {
         return res.status(200).json({statusCode:200,status : 'success'});
      }  
    
    else
    {
      return res.status(422).json({statusCode:422,status : 'failed'}); 

    }

   }
        request.get(options, callback);
}