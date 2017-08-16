import cuid from 'cuid';
//import slug from 'slug';
import sanitizeHtml from 'sanitize-html';
import request from 'request';
var logger = require('../logger/logger');

var  headers =  {
 'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
 'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
 'kibo-client-id': 'cd89f71715f2014725163952',
 }

var baseURL = `https://api.kibosupport.com`
var azure = require('azure-sb');
var notificationHubService = azure.createNotificationHubService('kiboengagetesthub','Endpoint=sb://kiboengagetesthub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=TDM/hTOZxsgXq7hFcvO3/cJ3PeoQCRD82COpO7hwWbM=');
//for ios production
var notificationHubService1 = azure.createNotificationHubService('KiboEngagePush','Endpoint=sb://kiboengagens.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=B2do9BVVK6ca1OQsJWQIE+6WlFfcGuWjr+280C+tIVY=');

/************************* Subgroup APIS ************************************/
export function createSubgroup(req, res) {
  //////console.log('create Subgroup is called');
  var token = req.headers.authorization;
  logger.serverLog('info', 'This is body in createSubgroup '+ JSON.stringify(req.body) );

  ////////console.log(req.body);
  //////console.log(req.body.channel);
   var options = {
      url: `${baseURL}/api/messagechannels/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json: req.body.subgroup


    };

    function callback(error, response, body) {
        ////console.log(body);
        //////console.log(error);
      if(!error  && response.statusCode == 201) {

            //send push notification to mobile clients
            sendPushNotification(body,"Subgroups","CreateSubgroup",token);

            return res.status(200).json({statusCode : 200,body});

    }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.post(options, callback);

  }


export function getsubgroups(req, res) {
  //////console.log('get getchannels is called');
  var token = req.headers.authorization;
  //////console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/messagechannels`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }


    };
    function callback(error, response, body) {
      ////console.log(body);
      //console.log(error);
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        ////////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }


export function getcustomersubgroups(req, res) {
  //console.log('get  customer channels is called');
  ////console.log(req.body);
   var  headers =  {
             'kibo-app-id' : req.body.appid,
             'kibo-app-secret': req.body.appsecret,
             'kibo-client-id': req.body.clientid,

      }


   var options = {
      url: `${baseURL}/api/messagechannels/`,
      rejectUnauthorized : false,
      headers


    };
    function callback(error, response, body) {
       //////console.log(error);
      if(!error  && response.statusCode == 200) {
        var info = JSON.parse(body);
        ////////console.log(info);
      return res.status(200).json(info);
    }

    else
    {
     return res.status(422).json({message:error});
    }
    }
    request.get(options, callback);
  }

export function destroySubgroup(req, res) {
  //console.log('destroySubgroup is called.');
  //console.log(req.headers);
  var token = req.headers.authorization;
  //console.log(token);
  //console.log(req.query.id);
  var id = req.query.id;
   var options = {
      url: `${baseURL}/api/messagechannels/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }

    };
    function callback(error, response, body) {

    //console.log(response.statusCode);
    //console.log(error);
    ////console.log(body);
      if(!error  && response.statusCode == 204) {
          //send push notification to mobile clients
        sendPushNotification(req.body.channel,"Subgroups","DeleteSubgroup",token);

        res.sendStatus(200);

   }
   else{
    //////console.log(error);
     res.sendStatus(422);
   }
 }
    request.delete(options, callback);

}

export function destroySubgroups(req, res) {
  console.log('destroySubGroups is called');
  const token = req.headers.authorization;
  const options = {
    url: `${baseURL}/api/messagechannels/deletesubgroups/`,
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

export function editSubgroup(req, res) {
  //////console.log('edit Subgroup is called');
  var token = req.headers.authorization;
  //console.log(token);
  //////console.log(req.body.channel);
  var id = req.body.subgroup._id;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/messagechannels/${id}`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json: req.body.subgroup
    };

    function callback(error, response, body) {
        ////console.log(body);
        //////console.log(error)
      if(!error  && response.statusCode == 200) {

            sendPushNotification(req.body.subgroup,"Subgroups","EditSubgroup",token);
            return res.status(200).json({statusCode : 200,body});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.put(options, callback);

  }



/*** channel wise calls for High Charts
**/

export function getsubgroupwisecalls(req, res) {
  //////console.log('edit Subgroup is called');
  var token = req.headers.authorization;
  console.log(req.body);
  //console.log(req.body.departmentid);
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/statsbymessagechannel`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },
      json: req.body
    };

    function callback(error, response, body) {
        ////console.log(body);
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


  export function getplatformwisecalls(req, res) {
  //////console.log('edit Subgroup is called');
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/statsbyplatform`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
        ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }


  /*** get dept wise call stats
  ***/


  export function getdeptwisecalls(req, res) {
  //////console.log('edit Subgroup is called');
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/deptcallstats`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }



  export function getpagewisecalls(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/pagestats`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }



  // get customer stats
  export function getcountrywisecalls(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/customers/reportsv2/statsbycountry`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }


  // mobile clients

export function getmobilecalls(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/customers/reportsv2/statsbymobile`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }


  // get top 10 customers

export function gettopcustomers(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/topcustomers`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }


// get visitor calls by agents

export function getagentwisecalls(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/visitorcalls/reportsv2/statsbyagents`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }


// get notifications stats


export function getagentnotifications(req, res) {
  var token = req.headers.authorization;
  //////console.log(id);
   var options = {
      url: `${baseURL}/api/notifications/statsbyagent`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`,

                 },

    };

    function callback(error, response, body) {
      ////console.log(body);
      if(!error  && response.statusCode == 200) {

            var info = JSON.parse(body)
            ////console.log(info)
            return res.status(200).json({statusCode : 200,info});
      }
    else
    {
      return res.status(422).json({statusCode : 422 ,body});

    }

   }
        request.get(options, callback);

  }

//for mobile customers
function sendPushNotification(data,tablename,operation,token){
  //console.log('sendPushNotification for channels is called');
   var options = {
                url: `${baseURL}/api/customers/`,
                rejectUnauthorized : false,
                headers :  {
                           'Authorization': `Bearer ${token}`
                           }


              };
              function callback(error1, response, body1) {
                 //////console.log(body);
                 ////console.log(error);
                var customers = JSON.parse(body1);
                if(!error1  && response.statusCode == 200) {
                             var payload = {
                                  data: {
                                    obj:data,
                                    tablename : tablename,
                                    operation : operation,
                                  },
                                  badge: 0
                                };

                            //tagname = tagname.substring(1);   //in kiboengage we will use customerid as a tagname
                            for(var i=0;i<customers.length;i++){

                              var tagname = 'Client-'+customers[i].customerID;
                              var iOSMessage = {
                                alert : operation,
                                sound : 'UILocalNotificationDefaultSoundName',
                                badge : payload.badge,
                                payload : payload,
                                'content-available' : true
                              };
                              var androidMessage = {
                                to : tagname,
                                priority : "high",
                                data : {
                                  message : payload
                                }
                              }
                              notificationHubService.gcm.send(tagname, androidMessage, function(error){
                                if(!error){
                                  //console.log('Azure push notification sent to Android using GCM Module, client number : '+ tagname);
                                } else {
                                  //console.log('Azure push notification error : '+ JSON.stringify(error));
                                }
                              });
                              notificationHubService.apns.send(tagname, iOSMessage, function(error){
                                if(!error){
                                  //console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
                                  //console.log(iOSMessage);
                                } else {
                                  //console.log('Azure push notification error : '+ JSON.stringify(error));
                                }
                              });
                              notificationHubService1.apns.send(tagname, iOSMessage, function(error){
                                if(!error){
                              //    console.log('Azure push notification sent to iOS using GCM Module, client number : '+ tagname);
                                } else {
                               //   console.log('Azure push notification error : '+ JSON.stringify(error));
                                }
                              });
                            }

                          }
                        }
                        request.get(options, callback);



}
