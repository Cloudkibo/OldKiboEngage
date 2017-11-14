import cuid from 'cuid';
//import slug from 'slug';
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
  var cr = req.body;
  console.log('create fb page');
  console.log(cr);
   var options = {
      url: `${baseURL}/api/fbpages/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json:req.body,


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


export function fbteams(req, res) {
  ////console.log('get deptagents is called');
  var token = req.headers.authorization;
  ////console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/fbpageteams/`,
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


export function getfbpages(req, res) {
  var token = req.headers.authorization;
   console.log(token);

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
  var cr = req.body;
  var id = req.body.fbpage.pageid;
  console.log('edit fb page');
  console.log(cr);
   var options = {
      url: `${baseURL}/api/fbpages/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json:req.body,


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

export function deletefbpages(req, res) {
  console.log('deletefbpages is called');
  const token = req.headers.authorization;
  const options = {
    url: `${baseURL}/api/fbpages/deletefbpages/`,
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
