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

export function getcustomerteams(req,res){
  //console.log('get customer team');
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
export function getteams(req, res) {
  //console.log('get getteams is called');
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
  var token = req.headers.authorization;
  var options = {
      url: `${baseURL}/api/groups`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 },
      form: {
           'groupname' : req.body.groupname,
           'groupdescription': req.body.groupdescription,
           'status' : req.body.status,
          }
      
     
    };
    function callback(error, response, body) {
      console.log(body);
      console.log(error);

      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info)
        if(info.status == 'success')
       {
            return res.status(200).json({statusCode : 200,status : info.status,message:info.msg});
       }
       else
       {
            return res.status(422).json({statusCode : 422 ,status : info.status,message:info.msg}); 
   
       }
    }
    else
    {
      return res.status(422).json({statusCode : 422 ,status : 'danger',message:error}); 

    }

   }
        request.post(options, callback);
   
  }

export function getTeam(req, res) {
  //console.log('getTeam is called.');
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
        res.status(200).json({team:info}); 
    
   }
   else{
    //console.log(error);
    res.status(422).json(info); 
   }
 }
        request.get(options, callback);
    
}


export function destroyTeam(req, res) {
  //console.log('destroyTeam is called.');
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

export function editteam(req, res) {
  //console.log('edit team is called');
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
 
 //get my teams
 export function getmyuserteams(req, res) {
  var token = req.headers.authorization;
  var options = {
      url: `${baseURL}/api/departments/mydepartmentsKiboEngage`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }
      
     
    };
    function callback(error, response, body) {
      console.log(error);
      console.log(body);
        if(!error  && response.statusCode == 200) {
       var info = JSON.parse(body);
       var totalDept = [];
       var isAgent = true;
       if(info.agentDept){
        isAgent = false;
        for(var i = 0;i< info.agentDept.length;i++){
          totalDept.push(info.agentDept[i].deptid);
        }
       }

       if(info.createdDept){
        isAgent = false;
         for(var i = 0;i< info.createdDept.length;i++){
          totalDept.push(info.createdDept[i]);
        }
       }

      if(isAgent == false){ 
      return res.status(200).json({depts:totalDept});
    }
    else{
     return res.status(200).json({depts:info}); 
    }
    }

    else
    {
     return res.status(422).json({message:error}); 
    }
    }
    request.get(options, callback);
  }

