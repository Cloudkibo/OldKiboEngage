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


export function getfbpages(req, res) {
  //console.log('create Response is called');
  var token = req.headers.authorization;

   var options = {
      url: `${baseURL}/api/fbpages/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
    


    };

    function callback(error, response, body) {
      console.log('getfbpages is called');
        console.log(body);
        console.log(error)
      if(!error) {
            return res.status(201).json(JSON.parse(body));
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,data:error});

    }

   }
        request.get(options, callback);

  }


export function getfbpage(req, res) {
  console.log('getfbpage is called');
  var token = req.headers.authorization;
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/fbpages/getpage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
    
      form:{
        'pageid':id,
      }

    };

    function callback(error, response, body) {
      console.log('getfbpage is called');
        console.log(body);
        console.log(error)
      if(!error) {
            return res.status(201).json(JSON.parse(body));
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,data:error});

    }

   }
        request.post(options, callback);

  }


export function editfbPage(req, res) {
  //console.log('create Response is called');
  var token = req.headers.authorization;
  //console.log(req.body);
  var cr = req.body.fbpage;
  var id = req.body.fbpage.pageid;
  console.log('edit fb page');
  console.log(cr);
   var options = {
      url: `${baseURL}/api/fbpages/${id}`,
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
            res.send({status: 'success', msg: 'Facebook page Info updated successfully'});
      }
    else
    {
        res.send({status: 'danger', msg: 'Error occured while updating page information. Please try later.'});

    }

   }
        request.put(options, callback);

  }



export function deletefbpage(req, res) {
  console.log('destroy Fbpage is called.');
  var token = req.headers.authorization;
  console.log(req.query.id);
  var id = req.query.id;

   var options = {
      url: `${baseURL}/api/fbpages/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    console.log(response.statusCode);
    console.log(error);
      
      if(!error) {
        res.status(200).json({status:'success'}); 
    
   }
   else{
   // //console.log(error);
    res.status(422).json({status:'fail'}); 
   }
 }
    request.delete(options, callback);
    
}