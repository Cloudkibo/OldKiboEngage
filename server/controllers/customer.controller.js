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

/**************Country Info****************************************/
export function getCountryName(req, res) {
  console.log('get getCountryName is called.');

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  console.log(ip);

  var ip2number = (parseInt(ip.split('.')[0]) * 256 * 256 * 256) + (parseInt(ip.split('.')[1]) * 256 * 256) + (parseInt(ip.split('.')[2]) * 256) + (parseInt(ip.split('.')[3]));
  console.log(ip2number);

  var needle = require('needle');

  var options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application',
      'kibo-app-id': '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
      'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
      'kibo-client-id': 'cd89f71715f2014725163952'
    }
  }

  needle.get('https://api.kibosupport.com/api/ipcountry/' + ip2number, options, function(err, resp) {

    if (err) {
      res.status(500).send(err);
    }

    console.log(resp.body);
    res.json(resp.body.country);
  });
}

/************************* Customer APIS ************************************/
export function createCustomer(req, res) {
  console.log('create Customer is called');

  console.log(req.body);
  console.log(req.body.customer);
  var options = {
      url: `${baseURL}/api/customers`,
      rejectUnauthorized : false,
      headers,
      json: req.body.customer


    };
    console.log(options.json);

    function callback(error, response, body) {
        console.log(error);
        console.log(response.statusCode);

        var customer = body;

       if(!error && response.statusCode == 201)
       {
          console.log(customer);
          return res.json(201, customer);
          // res.sendStatus(200);
       //     return res.status(200).json({statusCode : 201,message:'success'});
       }
       else
       {
         res.sendStatus(422);
         //   return res.status(422).json({statusCode : 422 ,message:'failed'});

       }


   }
        request.post(options, callback);

  }


export function getcustomers(req, res) {
  console.log('get getcustomers is called');
  var token = req.headers.authorization;
  console.log('token received is  : ' + token);
  var options = {
      url: `${baseURL}/api/customers/`,
      rejectUnauthorized : false,
      headers :  {
                 'Authorization': `Bearer ${token}`
                 }


    };
    function callback(error, response, body) {
       //console.log(body);
       //console.log(error);

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


/***** email customer***/
export function emailCustomer(req, res) {
  console.log('emailCustomer API is called');
  var token = req.headers.authorization;
  console.log(req.body);
  var emailAction;
  if(req.body.emailAdd)
  {
  //sendemail(req.body);
  //console.log('Email sent successfully')
      var body = req.body;
      var sendgrid = require("sendgrid")('cloudkibo','cl0udk1b0');
      var email     = new sendgrid.Email({
                    to:       body.emailAdd,
                    from:     'support@cloudkibo.com',
                    subject:   body.subject,
                    text:     body.body,
                  });


      email.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                    '<p style="color: #ffffff">' + body.subject +' </p> </td></tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                    '<tr> <td class="wrapper last"> <p> Dear,'+ body.to+'<br> ' + body.body +'<br><br>  </p>Regards,<br/> '+ body.from + '<br/>KiboEngage<br/></p></p><!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                    '</table> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')


      sendgrid.send(email, function(err, json) {
                      if (err) { return res.status(422).json({statusCode : 422}); }
                      return res.status(200).json({statusCode : 200});
            });


  }
  else
  {
         return res.status(422).json({statusCode : 422});
  }
  }



export function rescheduleEmail(req, res) {
  console.log('rescheduleEmail API is called');
  var token = req.headers.authorization;
  console.log(req.body);
  var emailAction;
  if(req.body.emailAdd)
  {
 // sendrescheduleemail(req.body);
      var body = req.body;
      var sendgrid = require("sendgrid")('cloudkibo','cl0udk1b0');
      var email     = new sendgrid.Email({
                    to:       body.emailAdd,
                    from:     'support@cloudkibo.com',
                    subject:   body.subject,
                    text:     body.body,
                  });


      email.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                    '<p style="color: #ffffff">' + body.subject +' </p> </td></tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                    '<tr> <td class="wrapper last"> <p> Dear '+ body.to+'<br/><br/> ' + body.body +'<br/><br/> Here is the link to join the chat: <br/>'+body.url+'<br/><br/> </p>Regards,<br/> '+ body.from + '<br/>KiboEngage<br/></p></p><!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                    '</table> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')


      sendgrid.send(email, function(err, json) {
                      if (err) { return res.status(422).json({statusCode : 422}); }
              return res.status(200).json({statusCode : 200});
            });


  }
  else
  {
         return res.status(422).json({statusCode : 422});
  }
  }
