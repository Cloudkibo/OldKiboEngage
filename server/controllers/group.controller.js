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

export function getcustomergroups(req,res){
  //console.log('get customer group');
      var options = {
      url: `${baseURL}/api/departments`,
      rejectUnauthorized : false,
      headers
    };
    function callback(error, response, body) {
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
export function getgroups(req, res) {
  //console.log('get getgroups is called');
  var token = req.headers.authorization;
  //console.log('token received is  : ' + token);
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


 export function creategroup(req, res) {
  //console.log('create group is called');
  var token = req.headers.authorization;
  //console.log('token received is  : ' + token);
  
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
        //console.log(body);
        //console.log(info.msg);
       //console.log(info.status);
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
  //console.log('getGroup is called.');
  var token = req.headers.authorization;
  //console.log('token received is  : ' + token);
  //console.log(req.query.id);
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
      //  //console.log(info);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({group:info}); 
    
   }
   else{
    //console.log(error);
    res.status(422).json(info); 
   }
 }
        request.get(options, callback);
    
}


export function destroyGroup(req, res) {
  //console.log('destroyGroup is called.');
  var token = req.headers.authorization;
  //console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/departments/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
     
    };
    function callback(error, response, body) {
    
    //console.log(response.statusCode);
    //console.log(error);
      var info = JSON.parse(body);

      //  //console.log(info.status);
        
      if(!error  && response.statusCode == 200) {
        res.status(200).json({info}); 
    
   }
   else{
   // //console.log(error);
    res.status(422).json(info); 
   }
 }
    request.delete(options, callback);
    
}

export function editgroup(req, res) {
  //console.log('edit group is called');
  var token = req.headers.authorization;
  //console.log(req.body.dept);
  //console.log(req.body.deptagents);
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
    //console.log(options.json.dept);
    function callback(error, response, body) {
        //console.log(body);
    
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
 