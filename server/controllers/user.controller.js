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
  return res.json({msg: 'login succeed.'});
}


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
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log('api calling succeed')
        console.log(info)

      }
      else
      {
        console.log(error);

        //  res.render('agents',data);

      }
    }

    request.post(options, callback);
  }
  return res.json({ user : "saved"});

}


