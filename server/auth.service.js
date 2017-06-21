var compose = require('composable-middleware');
function isAuthorizedWebHookTrigger(){
  return compose()
    .use(function(req, res, next){
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
      console.log(req.ip);
      console.log(ip);
      console.log('This is middleware');
      console.log(req.body)
      if(ip === '::ffff:162.243.215.177')
        console.log('ip matched')
        next();
      else
        res.send(403);
    });
}
exports.isAuthorizedWebHookTrigger = isAuthorizedWebHookTrigger;
