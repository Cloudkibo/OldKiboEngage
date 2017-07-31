import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
import Buffer from 'Buffer';
import path from 'path';
var fs = require('fs');
var logger = require('../logger/logger');
var ss = require('../routes/socket');

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
  'content-type' : 'application/x-www-form-urlencoded'
 }

var baseURL = `https://api.kibosupport.com`
//var baseURL = `https://192.168.8.101:8443`
export function getlogin (req,res) {
  ////console.log('Login api is called.');

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
      console.log(body);
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        ////console.log('api calling succeed')
       // ////console.log(info)
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
        ////console.log(response.error);

        res.status(501).send({message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);
  }
};


export function signupUser(req, res) {
  ////console.log('i am called');
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
    ////console.log(options.form);
    function callback(error, response, body) {

      var validationErr =[];
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log('signup api calling succeed')
        //console.log(info)
        validationErr.push('Your account is created successfully')
        return res.json({signup:{ validationErrs :validationErr ,token : info.token,statusCode : response.statusCode}});

      }
       else if (response.statusCode == 422) {
       ////console.log('validation errors');
       var errs = JSON.parse(body).errors;

       for(var err in errs)
       {

       validationErr.push(errs[err].message);
       }
       ////console.log(validationErr);
       return res.json({signup:{ validationErrs : validationErr ,token : '',statusCode : response.statusCode}});
      }
      else
      {
        ////console.log(error);
        validationErr.push(error)
        return res.json({signup:{ validationErrs :validationErr ,token : '',statusCode : response.statusCode}});

      }
    }

    request.post(options, callback);
  }


}




export function getuser(req, res) {
  ////console.log('get user is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
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
        ////console.log(response.statusCode)
      return res.status(200).json({status:200,info:info});
    }

    else
    {
     return res.status(422).json({status:422,message:error});
    }
    }
    request.get(options, callback);
  }



//get company settings
export function getcompanyprofile(req, res) {
  ////console.log('get user is called');
  var token = req.headers.authorization;
  var id = req.headers.id;
  //console.log(id);
  var options = {
      url: `${baseURL}/api/companyprofiles/fetch`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }


    };
    function callback(error, response, body) {
     //console.log(body);
      if(response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log(info)
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
  ////console.log('get deptagent is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
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
        ////console.log(info.agents.length)
      //  ////console.log(info.agents);
        //////console.log(info);
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
  ////console.log('get deptagents is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
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
       // ////console.log(info)

        //////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }



export function deptteams(req, res) {
  ////console.log('get deptagents is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/deptteams/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }


    };
    function callback(error, response, body) {
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
       // ////console.log(info)

        //////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }

export function deleteAgents(req, res) {
  console.log('deleteAgents is called');
  const token = req.headers.authorization;
  const options = {
    url: `${baseURL}/api/deleteagents/`,
    rejectUnauthorized: false,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: {
      "ids": req.body.ids,
    },
  };

  function callback(error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
      if (body.status == 'success') {
        return res.status(200).json({ statusCode: 200, message: body.msg });
      } else {
        return res.status(422).json({ statusCode: 422, message: body.msg });
      }
    } else {
      return res.status(422).json({ statusCode: 422, message: error });
    }
  }
  request.post(options, callback);
}

export function deleteAgent(req, res) {
  ////console.log('deleteAgent is called.');
  var token = req.headers.authorization;
  ////console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/users/deleteagent/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }

    };
    function callback(error, response, body) {

    ////console.log(response.statusCode);
    ////console.log(error);
      var info = JSON.parse(body);

      //  ////console.log(info.status);

      if(!error  && response.statusCode == 200) {
        res.status(200).json({info});

   }
   else{
   // ////console.log(error);
    res.status(422).json(info);
   }
 }
    request.post(options, callback);

}




export function editagent(req, res) {
  ////console.log('edit agent is called');
  var token = req.headers.authorization;
  ////console.log(req.body);
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
        ////console.log(error);
        var info = JSON.parse(body);
        ////console.log(info.msg);
       ////console.log(info.status);

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
  ////console.log('invite agent is called');
  var token = req.headers.authorization;
  ////console.log(req.body);
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
        ////console.log(error);
        var info = JSON.parse(body);
        ////console.log(info.msg);
       ////console.log(info.status);

      if(!error  && response.statusCode == 200) {
       if(info.status == 'success')
       {
            return res.status(200).json({statusCode : 200,message:info.msg,url:info.url});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,message:info.msg});

       }
    }


   }
        request.post(options, callback);

  }
/************************* Canned Response APIs *********************************/
export function createResponse(req, res) {
  ////console.log('create Response is called');
  var token = req.headers.authorization;
  ////console.log(req.body);
  var cr = req.body;
   var options = {
      url: `${baseURL}/api/shortcuts/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      form: {
           'shortcode' : req.body.shortcode,
           'message': req.body.message,
           'companyid' : req.body.companyid

          }


    };

    function callback(error, response, body) {
        ////console.log(body);
        ////console.log(error)
      if(!error  && response.statusCode == 201) {
            return res.status(201).json({statusCode : 201,data : body});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,data:error});

    }

   }
        request.post(options, callback);

  }


export function getresponses(req, res) {
  ////console.log('get getresponses is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/shortcuts/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }


    };
    function callback(error, response, body) {
      ////console.log(body);
       ////console.log(error);
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


export function destroyResponse(req, res) {
  ////console.log('destroyResponse is called.');
  var token = req.headers.authorization;
  ////console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/shortcuts/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }

    };
    function callback(error, response, body) {

    ////console.log(response.statusCode);
    ////console.log(error);
      if(!error  && response.statusCode == 204) {
        res.sendStatus(200);

   }
   else{
    ////console.log(error);
     res.sendStatus(422);
   }
 }
    request.delete(options, callback);

}

export function editResponse(req, res) {
  ////console.log('edit Response is called');
  var token = req.headers.authorization;
  ////console.log(req.body);
  ////console.log(req.body.response);
  var id = req.body.response._id;
  ////console.log(id);
   var options = {
      url: `${baseURL}/api/shortcuts/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json: req.body.response


    };

    function callback(error, response, body) {
        ////console.log(body);
        ////console.log(error)
      if(!error  && response.statusCode == 201) {

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

  ////console.log('invitetoken is called');
  ////console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/inviteagenttokens?id=${id}`,
      rejectUnauthorized : false,

    };

    function callback(error, response, body) {
        ////console.log(body);
        ////console.log(response.statusCode);
        ////console.log(error);
        ////console.log(body.length);
        var parsedJSON = JSON.parse(body);
        console.log(parsedJSON);
        var email=''
       for (var i=0;i<parsedJSON.length;i++) {
        if(parsedJSON[i].token == id){
          email = parsedJSON[i];
          break;

        }
            ////console.log(parsedJSON[i].email);
         }

      if(!error && body.length == 0)
      {
         return res.status(200).json({statusCode : 422 ,error});
      }
      else if(!error && body.length != 0) {


            return res.status(200).json({statusCode : 200 ,body:email});
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
  //console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/verificationtokens/kiboengage/${id}`,
      rejectUnauthorized : false,

    };

    function callback(error, response, body) {

      console.log(body);
      console.log(response.status);
      body = JSON.parse(body);
      if(!error && body != "Not Found")
      {
        console.log('success');
        console.log(body);
          ss.verifyThisAccount(body.body.email, body.body.uniqueid);
         return res.status(200).json({statusCode:200,status : 'success'});
      }

    else
    {
      return res.status(422).json({statusCode:422,status : 'failed'});

    }

   }
        request.get(options, callback);
}



/****** forgot password *********/

export function forgotpassword (req,res) {
  if (!req.body.email || !req.body.website ) {
    return res.status(403).end();
  }
  else
  {
    var user = req.body;
    var options = {
      url: `${baseURL}/api/users/requestpasswordchangeKiboEngage`,
      rejectUnauthorized : false,
      headers:headers,
      form: {
        'email'     :user.email,
        'website' : user.website
      }
    };
    function callback(error, response, body) {
      ////console.log(response.statusCode);
      if (!error) {
        var info = JSON.parse(body);
        ////console.log('api calling succeed')
        //console.log(info)
        return res.status(200).send({status:info.status,message:info.msg});

      }

      else
      {
        //console.log(error);

        res.status(501).send({message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);
  }
};

export function verifypasswordResettoken(req,res){

   var id = req.query.id;
   //console.log(id);
   var options = {
      url: `${baseURL}/api/passwordresettokens/${id}`,
      rejectUnauthorized : false,

    };

    function callback(error, response, body) {
      //console.log(body);
      //console.log(response.statusCode);
      if(!error && response.statusCode == 200)
      {
         return res.status(200).json({statusCode:200,status : 'success'});
      }

    else
    {
      //console.log(error);

      return res.status(200).json({statusCode:422,status : 'failed'});

    }

   }
        request.get(options, callback);
}



export function changepassword (req,res) {
  if (!req.body.token || !req.body.password) {
    return res.status(403).end();
  }
  else
  {
    var user = req.body;
    var options = {
      url: `${baseURL}/api/users/changepassword`,
      rejectUnauthorized : false,
      headers:headers,
      form: {
        'token'     :user.token,
        'password' : user.password
      }
    };
    function callback(error, response, body) {
      //console.log(response.statusCode);
      //console.log(body);
      if (!error && response.statusCode == 200) {
        return res.status(200).send({status:'success',message:body});

      }

      else
      {
        //console.log(error);

        res.status(501).send({status :'danger',message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);
  }
};



// update profile
export function updateprofile (req,res) {

    var user = req.body;
    var token = req.headers.authorization;

    var options = {
      url: `${baseURL}/api/users/updateprofile`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      form: {
        'firstname' :user.firstname,
        'lastname'  :user.lastname,
        'phone'     :user.phone,
        'country'     :user.country,
        'state'     :user.state,
        'city'     :user.city,
      }
    };
    function callback(error, response, body) {
      ////console.log(response.statusCode);
      if (!error) {
        var info = JSON.parse(body);
        ////console.log('api calling succeed')
        //console.log(info)
        return res.status(200).send({status:'success',message:'Information has been updated successfully.'});

      }

      else
      {
        //console.log(error);

        res.status(501).send({status:'danger',message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);

};


// verify account
export function verifyaccount (req,res) {

var token = req.headers.authorization;
    //console.log('verify account is called');
    var options = {
      url: `${baseURL}/api/users/reapplyverificationlink/kiboengage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };
    function callback(error, response, body) {
      ////console.log(response.statusCode);
      if (!error) {
        //var info = JSON.parse(body);
        ////console.log('api calling succeed')
        //console.log(body)
        return res.status(200).send({status:'success',message:'Check your inbox. Verification link has been emailed to you.'});

      }

      else
      {
        //console.log(error);

        res.status(501).send({status:'danger',message:"Something went wrong, please try again.",statusCode:501});
      }
    }

    request.get(options, callback);

};



//change password

export function changenewpassword(req,res) {

    var user = req.body;
    var token = req.headers.authorization;

    var options = {
      url: `${baseURL}/api/users/resetpassword`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      form: {
       'email' : user.email,
       'password' : user.password,
       'newpassword' :user.newpassword
      }
    };
    function callback(error, response, body) {
      //console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        return res.status(200).send({status:'success',message:'Password has been changed successfully.'});

      }
      else if(!error && response.statusCode == 403)
      {

        res.status(403).send({status:'danger',message:"Authentication failed."});
      }
      else
      {
        //console.log(error);

        res.status(501).send({status:'danger',message:"Something went wrong, please try again.", user: user,statusCode:501});
      }
    }

    request.post(options, callback);

};



//update company settings

export function updatesettings (req,res) {

    console.log('update settings is called');
    console.log('req body');

  //  console.log(req.body);
  //  console.log(req.files);
    var company = JSON.parse(req.body.companyprofile);
    console.log(company);
    var token = req.headers.authorization;

    if(req.files.file)
    {

            var serverPath = req.files.file.originalFilename;
            //serverPath += '.' + req.files.file.type.split('/')[1];

          //console.log(__dirname);
          //console.log(req.headers);
          var dir = "./static/companyfiles";

          if(req.files.file.size == 0) return res.send('No file submitted');

          fs.readFile(req.files.file.path, function (err, data) {
             var pathNew = dir + "/" + serverPath;
             console.log(pathNew);
            company.widgetlogoURL = './companyfiles/'+serverPath;
            var options = {
              url: `${baseURL}/api/companyprofiles/updatecompanyprofile`,
              rejectUnauthorized : false,
              headers :  {
                         'Authorization': `Bearer ${token}`,

                         },
              json:company
            };

                console.log(company);

                fs.writeFile(pathNew, data, function (err) {
                  if(!err){
                   function callback(error, response, body) {
                            //console.log(body);
                            if (!error && response.statusCode == 200) {

                              console.log('api calling succeed')
                              return res.status(200).send({status:'success',message:'Information has been updated successfully.',company:company});

                            }

                            else
                            {
                              //console.log(error);

                              res.status(501).send({status:'danger',message:body.msg,statusCode:501});
                            }
                           }
                             request.post(options, callback);

                  }

                });
            });

        }
      else{
        var options = {
              url: `${baseURL}/api/companyprofiles/updatecompanyprofile`,
              rejectUnauthorized : false,
              headers :  {
                         'Authorization': `Bearer ${token}`,

                         },
              json:company
            };


          function callback(error, response, body) {
                            console.log(body);
                            if (!error && response.statusCode == 200) {

                              console.log('api calling succeed')
                              return res.status(200).send({status:'success',message:'Information has been updated successfully.',company:company});

                            }

                            else
                            {
                              //console.log(error);

                              res.status(501).send({status:'danger',message:body.msg,statusCode:501});
                            }
                           }
                           request.post(options, callback);



      }


};



//upload picture


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


function getRandomSalt() {
    var milliseconds = new Date().getTime();
    var timestamp = (milliseconds.toString()).substring(9, 13)
    var random = ("" + Math.random()).substring(2, 8);
    var random_number = timestamp+random;  // string will be unique because timestamp never repeat itself
    /*var random_string = base64_encode(random_number).substring(2, 8); // you can set size here of return string
    var return_string = '';
    var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    if (random_string.match(Exp)) {                 //check here whether string is alphanumeric or not
        return_string = random_string;
    } else {
        return getRandomSalt();  // call recursivley again
    }*/
    return random_number;
}

export function uploadpicture (req,res)
{
  //console.log('file upload is called');
  var token = req.headers.authorization;
 /* first delete previous profile picture*/
 if(req.body.oldprofile && req.body.oldprofile != ""){
  var foldfile = path.join(path.resolve(__dirname, '../../static'),'profileImages',req.body.oldprofile);
  fs.unlink(foldfile,function(err){
        if(err) return //console.log(err);
        //console.log('file deleted successfully');
   });
}

  var imageBuffer = decodeBase64Image(req.body.file);
  var file_ext = req.body.fileName.substr((Math.max(0, req.body.fileName.lastIndexOf(".")) || Infinity) + 1);
  var newFileName = getRandomSalt() + '.' + file_ext;
  var saveTo = path.join(path.resolve(__dirname, '../../static'),'profileImages',newFileName);
  //console.log(saveTo);
  //var f=fs.createWriteStream(saveTo);
  fs.writeFile(saveTo, imageBuffer.data, function (err) {
   if(err){
          //console.log('error occured in writing file');
          res.status(501).send({status:'danger',message:"Something went wrong, please try again."});

   }


   else{
          //console.log('file saved on server');
          var options = {
            url: `${baseURL}/api/users/updateprofilepicture`,
            rejectUnauthorized : false,
            headers :  {
                       'Authorization': `Bearer ${token}`,

                       },
            form: {
              'picture' :newFileName,

            }
          };
          function callback(error, response, body) {
            //console.log(response.statusCode);
            //console.log(body);
            if (!error && response.statusCode == 200) {


              return res.status(200).send({status:'success',message:'Profile picture uploaded successfully.'});

            }

            else
            {
            //  //console.log(error);

              res.status(501).send({status:'danger',message:"Something went wrong, please try again."});
            }
          }

          request.post(options, callback);

      }
});


  //fs.end();

};




//get company settings
export function getcompanylogo(req, res) {
  ////console.log('get user is called');
  var  headers =  {
             'kibo-app-id' : req.body.appid,
             'kibo-app-secret': req.body.appsecret,
             'kibo-client-id': req.body.clientid,

      }
  var token = req.headers.authorization;
  var id = req.body.clientid;
  //console.log(id);
  var options = {
      url: `${baseURL}/api/companyprofiles/fetch`,
      rejectUnauthorized : false,
      headers :  headers


    };
    function callback(error, response, body) {
     //console.log(body);
      if(response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log(info)
      return res.status(200).json({logourl:info.widgetlogoURL});
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }



  export function getinvitedagents(req, res) {
  console.log('get getinvitedagents is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/inviteagenttokens/`, //call tempaccounts
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
    };

    function callback(error, response, body) {
      if(response.statusCode == 200) {
        var info = JSON.parse(body);
        ////console.log(response.statusCode)
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }
