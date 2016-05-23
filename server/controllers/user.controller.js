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


export function getlogin (req,res) {
  console.log('Login api is called.');

  if (!req.body.email || !req.body.password || !req.body.website ) {
    return res.status(403).end();
  }
  else
  {
    var user = req.body;
    var options = {
      url: 'https://api.kibosupport.com/auth/local',
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
        console.log(info)
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
      url: 'https://api.kibosupport.com/api/users/',
      rejectUnauthorized : false,
      headers:headers,
      form: {
            'firstname' :user.firstname,
            'lastname'  :user.lastname,
            'email'     :user.email,
            'phone'     :user.phone,
            'password'   : user.password,
            'companyName':user.companyName,
            'website' : user.website

          }
    };
    console.log(options.form);
    function callback(error, response, body) {

      var validationErr =[];
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log('api calling succeed')
        console.log(info)
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
      url: 'https://api.kibosupport.com/api/users/me',
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
      url: 'https://api.kibosupport.com/api/departments',
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
