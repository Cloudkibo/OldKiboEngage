import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
import Buffer from 'Buffer';
import path from 'path';
import fs from 'fs';

var logger = require('../logger/logger');

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
  'content-type' : 'application/x-www-form-urlencoded'
 }

var baseURL = `https://api.kibosupport.com`
//var baseURL = `https://192.168.8.100:3000`
/************************* Canned Response APIs *********************************/
export function createfbPage(req, res) {
  //console.log('create Response is called');
  var token = req.headers.authorization;
  //console.log(req.body);
  var cr = req.body.fbpage;
  console.log('create fb page');
  console.log(cr);
   var options = {
      url: `${baseURL}/api/fbpages/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json:req.body.fbpage,


    };

    function callback(error, response, body) {
        console.log(body);
        console.log(error)
      if(!error) {
            return res.status(201).json({statusCode : 201,data : body});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,data:error});

    }

   }
        request.post(options, callback);

  }
